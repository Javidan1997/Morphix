function json(response, status, body) {
  response.status(status).setHeader("Content-Type", "application/json").send(JSON.stringify(body));
}

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function buildErpNextHeaders() {
  const token = process.env.ERPNEXT_API_TOKEN;
  let apiKey = process.env.ERPNEXT_API_KEY;
  let apiSecret = process.env.ERPNEXT_API_SECRET;

  if ((!apiKey || !apiSecret) && token) {
    const parts = token.split(":");
    if (parts.length === 2 && parts[0] && parts[1]) {
      [apiKey, apiSecret] = parts;
    }
  }

  if (!apiKey || !apiSecret) {
    throw new Error(
      "Missing ERPNext credentials. Set ERPNEXT_API_KEY + ERPNEXT_API_SECRET or ERPNEXT_API_TOKEN (key:secret).",
    );
  }

  return {
    "Content-Type": "application/json",
    Authorization: `token ${apiKey}:${apiSecret}`,
  };
}

function getErpNextBaseUrl() {
  return getRequiredEnv("ERPNEXT_BASE_URL").replace(/\/$/, "");
}

function toLeadPayload(inquiry) {
  return {
    lead_name: inquiry.fullName || inquiry.email || "Website Lead",
    email_id: inquiry.email || "",
    company_name: inquiry.company || "",
    website: inquiry.website || "",
    source: "Website",
    notes: [
      {
        note: [
          `Source: ${inquiry.source || "website"}`,
          `Product: ${inquiry.productName || ""}`,
          `Project Type: ${inquiry.projectType || ""}`,
          `Timeline: ${inquiry.timeline || ""}`,
          `Budget: ${inquiry.budget || ""}`,
          `Brief: ${inquiry.brief || ""}`,
          `Deliverables: ${(inquiry.deliverables || []).join(", ")}`,
          `Goals: ${(inquiry.goals || []).join(", ")}`,
        ].join("\n"),
      },
    ],
  };
}

async function erpFetch(path, options = {}) {
  const url = `${getErpNextBaseUrl()}${path}`;
  const headers = buildErpNextHeaders();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message = typeof data === "string" ? data : data?.message || "ERPNext request failed";
    throw new Error(message);
  }

  return data;
}

async function findLeadByEmail(email) {
  const filters = JSON.stringify([["Lead", "email_id", "=", email]]);
  const fields = JSON.stringify(["name", "email_id", "lead_name"]);
  const query = `?filters=${encodeURIComponent(filters)}&fields=${encodeURIComponent(fields)}&limit_page_length=1`;

  const result = await erpFetch(`/api/resource/Lead${query}`, { method: "GET" });
  const row = result?.data?.[0];
  return row || null;
}

async function createLead(inquiry) {
  const result = await erpFetch("/api/resource/Lead", {
    method: "POST",
    body: JSON.stringify(toLeadPayload(inquiry)),
  });

  return result?.data;
}

function parseBudgetRate(budget) {
  if (!budget) return Number(process.env.ERPNEXT_DEFAULT_RATE || 0);

  const normalized = String(budget).replace(/[^0-9.]/g, "");
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) {
    return Number(process.env.ERPNEXT_DEFAULT_RATE || 0);
  }

  return parsed;
}

function getFutureDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

async function createQuotation(lead, inquiry) {
  const itemCode = process.env.ERPNEXT_QUOTATION_ITEM_CODE;
  if (!itemCode) {
    return { skipped: true, reason: "ERPNEXT_QUOTATION_ITEM_CODE is not set" };
  }

  const itemName = process.env.ERPNEXT_QUOTATION_ITEM_NAME || "Discovery and Scope";
  const quotationCurrency = process.env.ERPNEXT_QUOTATION_CURRENCY || "USD";
  const company = process.env.ERPNEXT_COMPANY;

  const quotationPayload = {
    quotation_to: "Lead",
    party_name: lead.name,
    transaction_date: new Date().toISOString().slice(0, 10),
    valid_till: getFutureDate(14),
    currency: quotationCurrency,
    order_type: "Sales",
    items: [
      {
        item_code: itemCode,
        item_name: itemName,
        qty: 1,
        rate: parseBudgetRate(inquiry.budget),
        description: inquiry.productName || inquiry.brief || "Website project scope",
      },
    ],
  };

  if (company) {
    quotationPayload.company = company;
  }

  const result = await erpFetch("/api/resource/Quotation", {
    method: "POST",
    body: JSON.stringify(quotationPayload),
  });

  return { skipped: false, quotation: result?.data || null };
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    json(response, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  try {
    const inquiry = request.body || {};

    if (!inquiry.fullName || !inquiry.email) {
      json(response, 400, { ok: false, error: "fullName and email are required" });
      return;
    }

    let lead = null;
    if (inquiry.email) {
      lead = await findLeadByEmail(inquiry.email);
    }

    if (!lead) {
      lead = await createLead(inquiry);
    }

    const quotationEnabled = String(process.env.ERPNEXT_ENABLE_QUOTATION || "true") !== "false";
    const quotationResult = quotationEnabled
      ? await createQuotation(lead, inquiry)
      : { skipped: true, reason: "Quotation creation disabled" };

    json(response, 200, {
      ok: true,
      lead: {
        name: lead?.name || null,
        email_id: lead?.email_id || inquiry.email,
      },
      quotation: quotationResult,
    });
  } catch (error) {
    json(response, 500, {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown ERPNext sync error",
    });
  }
}
