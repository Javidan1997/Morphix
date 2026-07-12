const ADMIN_LOCAL_SESSION_KEY = "morphix.admin.session.local.v2";
const ADMIN_TEMP_SESSION_KEY = "morphix.admin.session.temp.v2";
const ADMIN_USERNAME = "javidan";
const ADMIN_PASSWORD = "Cavidan1997@";

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

export function clearStoredAdminSession() {
  clearAdminSession();
}

export function getAdminCredentialConfig() {
  return {
    username: ADMIN_USERNAME,
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

export function validateAdminCredentials(username, password) {
  return (
    username.trim().toLowerCase() === ADMIN_USERNAME.toLowerCase()
    && password === ADMIN_PASSWORD
  );
}
