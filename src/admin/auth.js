// Admin session storage. Production sign-in goes through Supabase Auth (see
// AdminAuthContext): only a real Supabase session can read inquiries, because
// row level security limits reads to users listed in public.configuro_admins.
//
// A local login exists only for development builds without Supabase, using
// VITE_ADMIN_EMAIL / VITE_ADMIN_PASSWORD from .env. No credential is ever
// hard-coded here, because this file ships to the browser.

const ADMIN_LOCAL_SESSION_KEY = "morphix.admin.session.local.v2";
const ADMIN_TEMP_SESSION_KEY = "morphix.admin.session.temp.v2";

const DEV_EMAIL = import.meta.env.DEV ? import.meta.env.VITE_ADMIN_EMAIL || "" : "";
const DEV_PASSWORD = import.meta.env.DEV ? import.meta.env.VITE_ADMIN_PASSWORD || "" : "";

function getStorage(type) {
  if (typeof window === "undefined") return null;
  return type === "local" ? window.localStorage : window.sessionStorage;
}

function readSessionFrom(storageKey, storageType) {
  const storage = getStorage(storageType);
  if (!storage) return null;
  try {
    const raw = storage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getAdminCredentialConfig() {
  return { username: DEV_EMAIL };
}

export function getStoredAdminSession() {
  const session = readSessionFrom(ADMIN_LOCAL_SESSION_KEY, "local") ?? readSessionFrom(ADMIN_TEMP_SESSION_KEY, "session") ?? null;
  // Sessions from the retired hard-coded login cannot read Supabase data.
  if (session && !session.accessToken && !session.devOnly) return null;
  return session;
}

export function clearAdminSession() {
  getStorage("local")?.removeItem(ADMIN_LOCAL_SESSION_KEY);
  getStorage("session")?.removeItem(ADMIN_TEMP_SESSION_KEY);
}

export const clearStoredAdminSession = clearAdminSession;

export function persistAdminSession(session, remember) {
  clearAdminSession();
  const storage = getStorage(remember ? "local" : "session");
  storage?.setItem(remember ? ADMIN_LOCAL_SESSION_KEY : ADMIN_TEMP_SESSION_KEY, JSON.stringify(session));
}

/** Development-only fallback when Supabase is not configured. */
export function validateDevCredentials(email, password) {
  return Boolean(DEV_EMAIL && DEV_PASSWORD) && email.trim().toLowerCase() === DEV_EMAIL.toLowerCase() && password === DEV_PASSWORD;
}
