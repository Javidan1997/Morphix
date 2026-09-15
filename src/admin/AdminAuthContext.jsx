import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  clearAdminSession,
  getAdminCredentialConfig,
  getStoredAdminSession,
  persistAdminSession,
  validateDevCredentials,
} from "./auth";
import { getSupabaseRows, isSupabaseConfigured, refreshSupabaseSession, signInWithSupabase, signOutSupabase } from "./supabaseClient";

const AdminAuthContext = createContext(null);
const REFRESH_MARGIN = 60 * 1000;

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredAdminSession());
  const credentialConfig = useMemo(() => getAdminCredentialConfig(), []);

  const store = useCallback((next) => {
    if (next) persistAdminSession(next, next.remember);
    else clearAdminSession();
    setSession(next);
  }, []);

  // Keep the Supabase access token fresh while the admin panel is open.
  useEffect(() => {
    if (!session?.refreshToken) return undefined;
    const wait = Math.max(0, (session.expiresAt || 0) - Date.now() - REFRESH_MARGIN);
    const timer = setTimeout(async () => {
      try {
        store(await refreshSupabaseSession(session));
      } catch {
        store(null);
      }
    }, wait);
    return () => clearTimeout(timer);
  }, [session, store]);

  const value = useMemo(() => ({
    session,
    credentialConfig,
    usesSupabase: isSupabaseConfigured(),
    login: async ({ username, password, remember }) => {
      if (isSupabaseConfigured()) {
        try {
          const next = await signInWithSupabase({ email: username.trim(), password });
          // A valid account that is not listed in configuro_admins would sign
          // in to an empty dashboard (RLS hides every lead). Say so instead.
          const membership = await getSupabaseRows("/rest/v1/configuro_admins?select=user_id", next).catch(() => []);
          if (!Array.isArray(membership) || membership.length === 0) {
            await signOutSupabase(next).catch(() => {});
            return { ok: false, error: "This account signed in, but it is not a Configuro admin, so it cannot see leads. Add it to configuro_admins in Supabase." };
          }
          store({ ...next, remember: Boolean(remember) });
          return { ok: true, session: next };
        } catch (error) {
          return { ok: false, error: error instanceof Error && /invalid/i.test(error.message) ? "The email or password is incorrect." : "Sign-in failed. Check your connection and try again." };
        }
      }
      if (!validateDevCredentials(username, password)) {
        return { ok: false, error: "The email or password is incorrect." };
      }
      const next = { username, name: "Configuro Admin (local dev)", loginAt: new Date().toISOString(), remember: Boolean(remember), devOnly: true };
      store(next);
      return { ok: true, session: next };
    },
    /** Called when Supabase rejects the token, e.g. after it was revoked. */
    expire: () => store(null),
    logout: async () => {
      if (session?.accessToken) await signOutSupabase(session).catch(() => {});
      store(null);
    },
  }), [credentialConfig, session, store]);

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth must be used within an AdminAuthProvider.");
  return context;
}
