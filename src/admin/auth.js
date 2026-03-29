const ADMIN_LOCAL_SESSION_KEY = "morphix.admin.session.local";
const ADMIN_TEMP_SESSION_KEY = "morphix.admin.session.temp";
const DEFAULT_ADMIN_EMAIL = "admin@configuro.studio";
const DEFAULT_ADMIN_PASSWORD = "MorphixAdmin2026!";

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

function writeSessionTo(storageKey, storageType, session) {
  const storage = getStorage(storageType);
  if (!storage) return;

  storage.setItem(storageKey, JSON.stringify(session));
}

export function getAdminCredentialConfig() {
  const hasCustomCredentials = Boolean(
    import.meta.env.VITE_ADMIN_EMAIL && import.meta.env.VITE_ADMIN_PASSWORD,
  );

  return {
    email: hasCustomCredentials ? import.meta.env.VITE_ADMIN_EMAIL.trim() : DEFAULT_ADMIN_EMAIL,
    password: hasCustomCredentials ? import.meta.env.VITE_ADMIN_PASSWORD : DEFAULT_ADMIN_PASSWORD,
    usingFallbackCredentials: !hasCustomCredentials,
  };
}

export function getStoredAdminSession() {
  return (
    readSessionFrom(ADMIN_LOCAL_SESSION_KEY, "local")
    ?? readSessionFrom(ADMIN_TEMP_SESSION_KEY, "session")
    ?? null
  );
}

export function clearAdminSession() {
  const localStorage = getStorage("local");
  const sessionStorage = getStorage("session");

  localStorage?.removeItem(ADMIN_LOCAL_SESSION_KEY);
  sessionStorage?.removeItem(ADMIN_TEMP_SESSION_KEY);
}

export function persistAdminSession(session, remember) {
  clearAdminSession();
  writeSessionTo(
    remember ? ADMIN_LOCAL_SESSION_KEY : ADMIN_TEMP_SESSION_KEY,
    remember ? "local" : "session",
    session,
  );
}

export function validateAdminCredentials(email, password) {
  const credentials = getAdminCredentialConfig();
  return (
    email.trim().toLowerCase() === credentials.email.trim().toLowerCase()
    && password === credentials.password
  );
}
