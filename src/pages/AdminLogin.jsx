import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import logoUrl from "../../branding/morphix-logo.svg";
import { useAdminAuth } from "../admin/AdminAuthContext";

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, login, credentialConfig } = useAdminAuth();
  const [form, setForm] = useState({
    email: credentialConfig.usingFallbackCredentials ? credentialConfig.email : "",
    password: "",
    remember: true,
  });
  const [error, setError] = useState("");

  const redirectPath = location.state?.from || "/admin";

  if (session) {
    return <Navigate to="/admin" replace />;
  }

  const updateField = (field, value) => {
    setError("");
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const result = login(form);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigate(redirectPath, { replace: true });
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-shell">
        <section className="admin-login-brand">
          <div className="admin-login-brand-head">
            <img src={logoUrl} alt="Morphix" />
            <span className="chip">Admin access</span>
          </div>

          <div className="admin-login-copy">
            <h1>Professional control for inquiries, content flow, and site readiness.</h1>
            <p>
              This admin panel gives your team one place to review incoming leads,
              track which pages are media-ready, and manage access without mixing it
              into the public website experience.
            </p>
          </div>

          <div className="admin-login-points">
            <article className="admin-login-point">
              <strong>Protected entry</strong>
              <span>Dedicated sign-in, separate shell, and persistent admin session handling.</span>
            </article>
            <article className="admin-login-point">
              <strong>Live inquiry review</strong>
              <span>New submissions from the public site appear in the dashboard and can be triaged by status.</span>
            </article>
            <article className="admin-login-point">
              <strong>Media planning visibility</strong>
              <span>Track which public pages already have image and render-video placeholders ready for production assets.</span>
            </article>
          </div>
        </section>

        <section className="glass-card admin-login-card">
          <div className="admin-login-card-head">
            <span className="metric-label">Sign in</span>
            <h2>Admin panel login</h2>
            <p>Use the configured admin credentials to open the Morphix control room.</p>
          </div>

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <label className="form-field">
              Email
              <input
                type="email"
                value={form.email}
                placeholder="admin@morphix.studio"
                onChange={(event) => updateField("email", event.target.value)}
                autoComplete="username"
              />
            </label>

            <label className="form-field">
              Password
              <input
                type="password"
                value={form.password}
                placeholder="Enter password"
                onChange={(event) => updateField("password", event.target.value)}
                autoComplete="current-password"
              />
            </label>

            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(event) => updateField("remember", event.target.checked)}
              />
              <span>Keep me signed in on this device</span>
            </label>

            {error ? <p className="admin-form-error">{error}</p> : null}

            <button className="primary-button admin-login-submit" type="submit">
              Open admin panel
            </button>
          </form>

          <div className="admin-login-note">
            <strong>Setup note</strong>
            <p>
              This version uses client-side credentials and browser storage for local management.
              Set <code>VITE_ADMIN_EMAIL</code> and <code>VITE_ADMIN_PASSWORD</code> before deployment.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminLogin;
