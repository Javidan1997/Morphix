const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

function buildHeaders() {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  };
}

function toSupabaseInquiry(inquiry) {
  return {
    created_at: inquiry.receivedAt,
    status: inquiry.status || "new",
    source: inquiry.source || "website",
    full_name: inquiry.fullName || "",
    email: inquiry.email || "",
    company: inquiry.company || "",
    website: inquiry.website || "",
    product_name: inquiry.productName || "",
    budget: inquiry.budget || "",
    timeline: inquiry.timeline || "",
    brief: inquiry.brief || "",
    metadata: {
      localId: inquiry.id,
      projectType: inquiry.projectType || "",
      productStage: inquiry.productStage || "",
      goals: inquiry.goals || [],
      deliverables: inquiry.deliverables || [],
      designPreviewPng: inquiry.designPreviewPng || "",
      templateDesign: inquiry.templateDesign || null,
      language: inquiry.language || "",
    },
  };
}

export async function insertSupabaseInquiry(inquiry) {
  if (!isSupabaseConfigured()) return { ok: false, skipped: true };

  const response = await fetch(`${SUPABASE_URL}/rest/v1/configuro_inquiries`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(toSupabaseInquiry(inquiry)),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Supabase inquiry insert failed.");
  }

  return { ok: true };
}
