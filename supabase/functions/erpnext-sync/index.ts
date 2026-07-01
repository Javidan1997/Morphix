import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
    },
  });
}

function getRequiredEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getErpNextBaseUrl() {
  return getRequiredEnv("ERPNEXT_BASE_URL").replace(/\/$/, "");
}

function buildErpNextHeaders() {
  const token = Deno.env.get("ERPNEXT_API_TOKEN");
  let apiKey = Deno.env.get("ERPNEXT_API_KEY");
  let apiSecret = Deno.env.get("ERPNEXT_API_SECRET");

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

function toLeadPayload(inquiry: Record<string, unknown>) {
  const source = String(inquiry.source ?? "website");
  const productName = String(inquiry.productName ?? "");
  const projectType = String(inquiry.projectType ?? "");
  const timeline = String(inquiry.timeline ?? "");
  const budget = String(inquiry.budget ?? "");
  const brief = String(inquiry.brief ?? "");
  const deliverables = Array.isArray(inquiry.deliverables)
    ? inquiry.deliverables.map((item) => String(item)).join(", ")
    : "";
  const goals = Array.isArray(inquiry.goals)
    ? inquiry.goals.map((item) => String(item)).join(", ")
    : "";

  return {
    lead_name: String(inquiry.fullName ?? inquiry.email ?? "Website Lead"),
    email_id: String(inquiry.email ?? ""),
    company_name: String(inquiry.company ?? ""),
    website: String(inquiry.website ?? ""),
    source: "Website",
    notes: [
      {
        note: [
          `Source: ${source}`,
          `Product: ${productName}`,
          `Project Type: ${projectType}`,
          `Timeline: ${timeline}`,
          `Budget: ${budget}`,
          `Brief: ${brief}`,
          `Deliverables: ${deliverables}`,
          `Goals: ${goals}`,
        ].join("\n"),
      },
    ],
  };
}

async function erpFetch(path: string, options: RequestInit = {}) {
  const url = `${getErpNextBaseUrl()}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...buildErpNextHeaders(),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message = typeof data === "string"
      ? data
      : (data as { message?: string })?.message || "ERPNext request failed";
    throw new Error(message);
  }

  return data;
}

async function findLeadByEmail(email: string) {
  const filters = JSON.stringify([["Lead", "email_id", "=", email]]);
  const fields = JSON.stringify(["name", "email_id", "lead_name"]);
  const query = `?filters=${encodeURIComponent(filters)}&fields=${encodeURIComponent(fields)}&limit_page_length=1`;

  const result = await erpFetch(`/api/resource/Lead${query}`, { method: "GET" }) as {
    data?: Array<Record<string, unknown>>;
  };

  return result?.data?.[0] || null;
}

async function createLead(inquiry: Record<string, unknown>) {
  const result = await erpFetch("/api/resource/Lead", {
    method: "POST",
    body: JSON.stringify(toLeadPayload(inquiry)),
  }) as { data?: Record<string, unknown> };

  return result?.data || null;
}

function parseBudgetRate(budget: unknown) {
  const defaultRate = Number(Deno.env.get("ERPNEXT_DEFAULT_RATE") || 0);
  if (!budget) return defaultRate;

  const normalized = String(budget).replace(/[^0-9.]/g, "");
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return defaultRate;

  return parsed;
}

function getFutureDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

async function createQuotation(lead: Record<string, unknown>, inquiry: Record<string, unknown>) {
  const itemCode = Deno.env.get("ERPNEXT_QUOTATION_ITEM_CODE");
  if (!itemCode) {
    return { skipped: true, reason: "ERPNEXT_QUOTATION_ITEM_CODE is not set" };
  }

  const itemName = Deno.env.get("ERPNEXT_QUOTATION_ITEM_NAME") || "Discovery and Scope";
  const quotationCurrency = Deno.env.get("ERPNEXT_QUOTATION_CURRENCY") || "USD";
  const company = Deno.env.get("ERPNEXT_COMPANY");

  const quotationPayload: Record<string, unknown> = {
    quotation_to: "Lead",
    party_name: String(lead.name ?? ""),
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
        description: String(inquiry.productName ?? inquiry.brief ?? "Website project scope"),
      },
    ],
  };

  if (company) {
    quotationPayload.company = company;
  }

  const result = await erpFetch("/api/resource/Quotation", {
    method: "POST",
    body: JSON.stringify(quotationPayload),
  }) as { data?: Record<string, unknown> };

  return { skipped: false, quotation: result?.data || null };
}

serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (request.method !== "POST") {
    return jsonResponse(405, { ok: false, error: "Method not allowed" });
  }

  try {
    const inquiry = await request.json() as Record<string, unknown>;
    const fullName = String(inquiry.fullName ?? "").trim();
    const email = String(inquiry.email ?? "").trim();

    if (!fullName || !email) {
      return jsonResponse(400, { ok: false, error: "fullName and email are required" });
    }

    let lead = await findLeadByEmail(email);
    if (!lead) {
      lead = await createLead(inquiry);
    }

    const quotationEnabled = String(Deno.env.get("ERPNEXT_ENABLE_QUOTATION") || "true") !== "false";
    const quotationResult = quotationEnabled
      ? await createQuotation(lead || {}, inquiry)
      : { skipped: true, reason: "Quotation creation disabled" };

    return jsonResponse(200, {
      ok: true,
      lead: {
        name: lead?.name || null,
        email_id: lead?.email_id || email,
      },
      quotation: quotationResult,
    });
  } catch (error) {
    return jsonResponse(500, {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown ERPNext sync error",
    });
  }
});
