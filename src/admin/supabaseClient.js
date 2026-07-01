const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

function buildHeaders({ accessToken, prefer } = {}) {
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${accessToken || SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  };

  if (prefer) {
    headers.Prefer = prefer;
  }

  return headers;
}

async function parseResponse(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function supabaseFetch(path, options = {}) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.");
  }

  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      ...buildHeaders(options),
      ...(options.headers || {}),
    },
  });
  const data = await parseResponse(response);

  if (!response.ok) {
    const message = typeof data === "string"
      ? data
      : data?.error_description || data?.msg || data?.message || "Supabase request failed.";
    throw new Error(message);
  }

  return data;
}

export async function signInWithSupabase({ email, password }) {
  const data = await supabaseFetch("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  return toAdminSession(data);
}

export async function refreshSupabaseSession(session) {
  if (!session?.refreshToken) return null;

  const data = await supabaseFetch("/auth/v1/token?grant_type=refresh_token", {
    method: "POST",
    body: JSON.stringify({ refresh_token: session.refreshToken }),
  });

  return toAdminSession(data, session.remember);
}

export async function signOutSupabase(session) {
  if (!session?.accessToken || !isSupabaseConfigured()) return;

  await supabaseFetch("/auth/v1/logout", {
    method: "POST",
    accessToken: session.accessToken,
  });
}

export async function getSupabaseRows(path, session) {
  return supabaseFetch(path, {
    method: "GET",
    accessToken: session?.accessToken,
  });
}

export async function postSupabaseRow(path, body, session, { returnRepresentation = true } = {}) {
  const data = await supabaseFetch(path, {
    method: "POST",
    accessToken: session?.accessToken,
    prefer: returnRepresentation ? "return=representation" : "return=minimal",
    body: JSON.stringify(body),
  });

  return Array.isArray(data) ? data[0] : data;
}

export async function patchSupabaseRow(path, body, session) {
  const data = await supabaseFetch(path, {
    method: "PATCH",
    accessToken: session?.accessToken,
    prefer: "return=representation",
    body: JSON.stringify(body),
  });

  return Array.isArray(data) ? data[0] : data;
}

function toAdminSession(authData, remember = true) {
  const user = authData?.user || {};
  const email = user.email || "";

  return {
    provider: "supabase",
    email,
    name: user.user_metadata?.name || email || "Configuro Admin",
    userId: user.id,
    accessToken: authData.access_token,
    refreshToken: authData.refresh_token,
    expiresAt: Date.now() + ((authData.expires_in || 3600) * 1000),
    loginAt: new Date().toISOString(),
    remember: Boolean(remember),
  };
}
