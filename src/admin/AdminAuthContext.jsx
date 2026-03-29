import { createContext, useContext, useMemo, useState } from "react";
import {
  clearAdminSession,
  getAdminCredentialConfig,
  getStoredAdminSession,
  persistAdminSession,
  validateAdminCredentials,
} from "./auth";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredAdminSession());
  const credentialConfig = useMemo(() => getAdminCredentialConfig(), []);

  const value = useMemo(() => ({
    session,
    credentialConfig,
    login: ({ email, password, remember }) => {
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
    logout: () => {
      clearAdminSession();
      setSession(null);
    },
  }), [credentialConfig, session]);

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
