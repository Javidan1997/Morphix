import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  clearAdminSession,
  getAdminCredentialConfig,
  getStoredAdminSession,
  persistAdminSession,
  validateAdminCredentials,
} from "./auth";
import {
  isSupabaseConfigured,
  refreshSupabaseSession,
  signInWithSupabase,
  signOutSupabase,
} from "./supabaseClient";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredAdminSession());
  const credentialConfig = useMemo(() => getAdminCredentialConfig(), []);
  const usesSupabaseAuth = isSupabaseConfigured();

  useEffect(() => {
    if (!usesSupabaseAuth || session?.provider !== "supabase") return undefined;

    const refreshWindowMs = 2 * 60 * 1000;
    const delay = Math.max(5000, (session.expiresAt || Date.now()) - Date.now() - refreshWindowMs);
    const id = window.setTimeout(() => {
      refreshSupabaseSession(session)
        .then((nextSession) => {
          if (!nextSession) return;
          persistAdminSession(nextSession, nextSession.remember);
          setSession(nextSession);
        })
        .catch(() => {
          clearAdminSession();
          setSession(null);
        });
    }, delay);

    return () => window.clearTimeout(id);
  }, [session, usesSupabaseAuth]);

  const value = useMemo(() => ({
    session,
    credentialConfig,
    usesSupabaseAuth,
    login: async ({ email, password, remember }) => {
      if (usesSupabaseAuth) {
        try {
          const nextSession = await signInWithSupabase({ email, password });
          const sessionWithPreference = {
            ...nextSession,
            remember: Boolean(remember),
          };

          persistAdminSession(sessionWithPreference, remember);
          setSession(sessionWithPreference);

          return {
            ok: true,
            session: sessionWithPreference,
          };
        } catch (error) {
          return {
            ok: false,
            error: error instanceof Error ? error.message : "Could not sign in.",
          };
        }
      }

      if (!validateAdminCredentials(email, password)) {
        return {
          ok: false,
          error: "The email or password is incorrect.",
        };
      }

      const nextSession = {
        email: credentialConfig.email,
        name: "Configuro Admin",
        loginAt: new Date().toISOString(),
        remember: Boolean(remember),
      };

      persistAdminSession(nextSession, remember);
      setSession(nextSession);

      return {
        ok: true,
        session: nextSession,
      };
    },
    logout: async () => {
      const currentSession = session;
      clearAdminSession();
      setSession(null);
      if (currentSession?.provider === "supabase") {
        signOutSupabase(currentSession).catch(() => {});
      }
    },
  }), [credentialConfig, session, usesSupabaseAuth]);

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider.");
  }

  return context;
}
