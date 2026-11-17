// node --test shopify/northgate/hubspot-webhook/
import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { verifyShopifyHmac, verifyHubSpotV3, parseNote, hubspotPayloads, onCustomerCreated } from "./server.mjs";

const customer = {
  id: 7200001,
  email: "buyer@acme.example",
  first_name: "Jordan",
  last_name: "Lee",
  tags: "trade-applicant",
  note: "Company: Acme Hospitality\nTax ID: GB123456789\nBusiness type: Hospitality\nMonthly spend: $5,000–20,000",
};

test("Shopify HMAC: accepts the right secret, rejects tampering", () => {
  const body = Buffer.from(JSON.stringify(customer));
  const sig = createHmac("sha256", "s3cret").update(body).digest("base64");
  assert.equal(verifyShopifyHmac(body, sig, "s3cret"), true);
  assert.equal(verifyShopifyHmac(Buffer.from("{}"), sig, "s3cret"), false);
  assert.equal(verifyShopifyHmac(body, sig, "other"), false);
});

test("HubSpot v3 signature with replay window", () => {
  const now = Date.now();
  const args = { method: "POST", uri: "https://x/webhooks/hubspot/approved", rawBody: "{}", timestamp: String(now), secret: "hs" };
  const signature = createHmac("sha256", "hs").update(`${args.method}${args.uri}${args.rawBody}${args.timestamp}`).digest("base64");
  assert.equal(verifyHubSpotV3({ ...args, signature, now }), true);
  assert.equal(verifyHubSpotV3({ ...args, signature, now: now + 10 * 60_000 }), false);
});

test("note fields become HubSpot properties", () => {
  assert.deepEqual(parseNote(customer.note)["Tax ID"], "GB123456789");
  const { contact, deal } = hubspotPayloads(customer);
  assert.equal(contact.inputs[0].id, "buyer@acme.example");
  assert.equal(deal.properties.dealname, "Trade application — Acme Hospitality");
  assert.equal(deal.properties.trade_business_type, "Hospitality");
});

test("non-trade customers are ignored (stub mode makes no calls)", async () => {
  assert.deepEqual(await onCustomerCreated({ ...customer, tags: "newsletter" }), { skipped: "not a trade application" });
});
