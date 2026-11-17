// Northgate — trade application → HubSpot, approval → Shopify customer tag.
// Zero dependencies (Node 20+). Deploy anywhere that runs Node, or port the two
// handlers to a serverless function.
//
//   SHOPIFY_WEBHOOK_SECRET   app client secret (verifies X-Shopify-Hmac-Sha256)
//   SHOPIFY_STORE, SHOPIFY_ADMIN_TOKEN   for tagging approved customers
//   HUBSPOT_TOKEN            private app token (crm.objects.contacts/deals write)
//   HUBSPOT_CLIENT_SECRET    verifies X-HubSpot-Signature-v3 on the approval hook
//   HUBSPOT_PIPELINE, HUBSPOT_STAGE_NEW   deal pipeline + stage for new applications
//
// Without HUBSPOT_TOKEN the service runs in STUB mode: it verifies and parses
// everything, then logs the HubSpot calls it would make instead of sending them.
//
// Flow
//   1. Buyer submits the theme's create_customer form (tag: trade-applicant,
//      note fields: Company, Tax ID, Business type, Monthly spend).
//   2. Shopify → POST /webhooks/shopify/customers-create   (this file)
//      → upsert HubSpot contact + create a "Trade application" deal.
//   3. Sales moves the deal to "Approved"; a HubSpot workflow webhook →
//      POST /webhooks/hubspot/approved with { email, shopifyCustomerId }
//      → Shopify tagsAdd trade-approved / tagsRemove trade-applicant.
//   4. The buyer logs in; Liquid now renders tier pricing and the quick-order grid.

import { createServer } from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";

const env = process.env;
const STUB = !env.HUBSPOT_TOKEN;
const API_VERSION = env.SHOPIFY_API_VERSION || "2026-10";
const seen = new Map(); // webhook id → time; Shopify retries, so dedupe

export function verifyShopifyHmac(rawBody, header, secret) {
  if (!header || !secret) return false;
  const digest = createHmac("sha256", secret).update(rawBody).digest();
  const given = Buffer.from(header, "base64");
  return given.length === digest.length && timingSafeEqual(given, digest);
}

// HubSpot v3 signature: base64(HMAC-SHA256(secret, method + uri + body + timestamp)),
// rejected if the timestamp is older than 5 minutes.
export function verifyHubSpotV3({ method, uri, rawBody, timestamp, signature, secret, now = Date.now() }) {
  if (!signature || !timestamp || !secret || Math.abs(now - Number(timestamp)) > 300_000) return false;
  const expected = createHmac("sha256", secret).update(`${method}${uri}${rawBody}${timestamp}`).digest();
  const given = Buffer.from(signature, "base64");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** Shopify stores customer[note][Label] fields as "Label: value" lines. */
export function parseNote(note = "") {
  const out = {};
  for (const line of String(note).split(/\r?\n/)) {
    const m = line.match(/^\s*([^:]+):\s*(.*)$/);
    if (m) out[m[1].trim()] = m[2].trim();
  }
  return out;
}

export function hubspotPayloads(customer) {
  const note = parseNote(customer.note);
  const company = note.Company || "";
  return {
    contact: {
      inputs: [{
        idProperty: "email",
        id: customer.email,
        properties: {
          email: customer.email,
          firstname: customer.first_name || "",
          lastname: customer.last_name || "",
          company,
          shopify_customer_id: String(customer.id),
          lifecyclestage: "lead",
        },
      }],
    },
    deal: {
      properties: {
        dealname: `Trade application — ${company || customer.email}`,
        pipeline: env.HUBSPOT_PIPELINE || "default",
        dealstage: env.HUBSPOT_STAGE_NEW || "appointmentscheduled",
        trade_tax_id: note["Tax ID"] || "",
        trade_business_type: note["Business type"] || "",
        trade_monthly_spend: note["Monthly spend"] || "",
        shopify_customer_id: String(customer.id),
      },
    },
  };
}

async function hubspot(path, body) {
  if (STUB) {
    console.log(`[stub] POST https://api.hubapi.com${path}\n${JSON.stringify(body, null, 2)}`);
    return { id: "stub" };
  }
  const res = await fetch(`https://api.hubapi.com${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.HUBSPOT_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HubSpot ${path} → ${res.status} ${await res.text()}`);
  return res.json();
}

async function shopifyGraphQL(query, variables) {
  const res = await fetch(`https://${env.SHOPIFY_STORE}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: { "X-Shopify-Access-Token": env.SHOPIFY_ADMIN_TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const body = await res.json();
  if (body.errors) throw new Error(JSON.stringify(body.errors));
  return body.data;
}

export async function onCustomerCreated(customer) {
  const tags = String(customer.tags || "").split(",").map((t) => t.trim());
  if (!tags.includes("trade-applicant")) return { skipped: "not a trade application" };
  const { contact, deal } = hubspotPayloads(customer);
  const upserted = await hubspot("/crm/v3/objects/contacts/batch/upsert", contact);
  const contactId = upserted.results?.[0]?.id ?? upserted.id;
  // Associate the deal with the contact (default deal→contact type 3).
  deal.associations = [{ to: { id: contactId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 3 }] }];
  const created = await hubspot("/crm/v3/objects/deals", deal);
  return { contactId, dealId: created.id };
}

export async function onApproved({ shopifyCustomerId }) {
  const id = String(shopifyCustomerId).startsWith("gid://") ? shopifyCustomerId : `gid://shopify/Customer/${shopifyCustomerId}`;
  const add = await shopifyGraphQL(`mutation($id: ID!) { tagsAdd(id: $id, tags: ["trade-approved"]) { userErrors { message } } }`, { id });
  const remove = await shopifyGraphQL(`mutation($id: ID!) { tagsRemove(id: $id, tags: ["trade-applicant"]) { userErrors { message } } }`, { id });
  const errors = [...add.tagsAdd.userErrors, ...remove.tagsRemove.userErrors];
  if (errors.length) throw new Error(errors.map((e) => e.message).join("; "));
  return { tagged: id };
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export function createApp() {
  return createServer(async (req, res) => {
    const reply = (status, body) => {
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(body));
    };
    try {
      const raw = await readBody(req);
      if (req.method === "POST" && req.url === "/webhooks/shopify/customers-create") {
        if (!verifyShopifyHmac(raw, req.headers["x-shopify-hmac-sha256"], env.SHOPIFY_WEBHOOK_SECRET)) return reply(401, { error: "bad hmac" });
        const id = req.headers["x-shopify-webhook-id"];
        if (id && seen.has(id)) return reply(200, { duplicate: true });
        if (id) seen.set(id, Date.now());
        if (seen.size > 5000) seen.delete(seen.keys().next().value);
        // Acknowledge fast (Shopify times out at 5 s); do the CRM work after.
        reply(200, { ok: true });
        onCustomerCreated(JSON.parse(raw)).then((r) => console.log("trade application", r), (e) => console.error(e));
        return;
      }
      if (req.method === "POST" && req.url === "/webhooks/hubspot/approved") {
        const ok = verifyHubSpotV3({
          method: "POST",
          uri: `https://${req.headers.host}${req.url}`,
          rawBody: raw.toString(),
          timestamp: req.headers["x-hubspot-request-timestamp"],
          signature: req.headers["x-hubspot-signature-v3"],
          secret: env.HUBSPOT_CLIENT_SECRET,
        });
        if (!ok) return reply(401, { error: "bad signature" });
        return reply(200, await onApproved(JSON.parse(raw)));
      }
      return reply(404, { error: "not found" });
    } catch (error) {
      console.error(error);
      return reply(500, { error: "internal" });
    }
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(env.PORT || 8787);
  createApp().listen(port, () => console.log(`northgate-hubspot listening on :${port}${STUB ? " (STUB mode: HubSpot calls are logged)" : ""}`));
}
