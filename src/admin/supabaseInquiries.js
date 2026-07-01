import {
  getSupabaseRows,
  isSupabaseConfigured,
  patchSupabaseRow,
  postSupabaseRow,
} from "./supabaseClient";

export { isSupabaseConfigured };

export function toSupabaseInquiry(inquiry) {
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

export function fromSupabaseInquiry(row) {
  const metadata = row?.metadata || {};

  return {
    id: row.id,
    status: row.status || "new",
    receivedAt: row.created_at,
    statusUpdatedAt: row.updated_at,
    source: row.source || "website",
    fullName: row.full_name || "",
    email: row.email || "",
    company: row.company || "",
    website: row.website || "",
    productName: row.product_name || "",
    brief: row.brief || "",
    projectType: metadata.projectType || "",
    productStage: metadata.productStage || "",
    goals: Array.isArray(metadata.goals) ? metadata.goals : [],
    deliverables: Array.isArray(metadata.deliverables) ? metadata.deliverables : [],
    timeline: row.timeline || "",
    budget: row.budget || "",
    designPreviewPng: metadata.designPreviewPng || "",
    templateDesign: metadata.templateDesign || null,
    language: metadata.language || "",
  };
}

export async function insertSupabaseInquiry(inquiry, session) {
  if (!isSupabaseConfigured()) return { ok: false, skipped: true };
  const returnRepresentation = Boolean(session?.accessToken);

  const row = await postSupabaseRow(
    "/rest/v1/configuro_inquiries",
    toSupabaseInquiry(inquiry),
    session,
    { returnRepresentation },
  );

  return { ok: true, inquiry: row ? fromSupabaseInquiry(row) : inquiry };
}

export async function readSupabaseInquiries(session) {
  if (!isSupabaseConfigured() || !session?.accessToken) return [];

  const rows = await getSupabaseRows(
    "/rest/v1/configuro_inquiries?select=*&order=created_at.desc",
    session,
  );

  return Array.isArray(rows) ? rows.map(fromSupabaseInquiry) : [];
}

export async function updateSupabaseInquiryStatus(inquiryId, status, session) {
  if (!isSupabaseConfigured() || !session?.accessToken) {
    return null;
  }

  const encodedId = encodeURIComponent(inquiryId);
  const row = await patchSupabaseRow(
    `/rest/v1/configuro_inquiries?id=eq.${encodedId}&select=*`,
    { status },
    session,
  );

  return row ? fromSupabaseInquiry(row) : null;
}
