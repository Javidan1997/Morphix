const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const EXPLICIT_SYNC_URL = import.meta.env.VITE_ERPNEXT_SYNC_URL?.replace(/\/$/, "");

function getSyncUrl() {
  if (EXPLICIT_SYNC_URL) return EXPLICIT_SYNC_URL;
  if (SUPABASE_URL) return `${SUPABASE_URL}/functions/v1/erpnext-sync`;
  return null;
}

function buildHeaders() {
  const headers = {
    "Content-Type": "application/json",
  };

  if (SUPABASE_ANON_KEY) {
    headers.apikey = SUPABASE_ANON_KEY;
    headers.Authorization = `Bearer ${SUPABASE_ANON_KEY}`;
  }

  return headers;
}

export async function syncInquiryToErpNext(inquiry) {
  const syncUrl = getSyncUrl();
  if (!syncUrl) {
    return { ok: false, skipped: true, reason: "ERPNext sync URL is not configured" };
  }

  const response = await fetch(syncUrl, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(inquiry),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "ERPNext sync failed.");
  }

  return response.json();
}
