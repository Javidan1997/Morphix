import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import logoUrl from "../../branding/morphix-logo.svg";
import { useAdminAuth } from "../admin/AdminAuthContext";

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, login, credentialConfig } = useAdminAuth();
  const [form, setForm] = useState({
    username: credentialConfig.username,
    password: "",
    remember: true,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = location.state?.from || "/admin/forms";

  if (session) {
    return <Navigate to="/admin/forms" replace />;
  }

  const updateField = (field, value) => {
    setError("");
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const result = await login(form);
    setIsSubmitting(false);
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
            <img src={logoUrl} alt="Configuro" />
            <span className="chip">Admin access</span>
          </div>

          <div className="admin-login-copy">
            <h1>Simple control for forms, stats, and follow-up.</h1>
            <p>
              This admin panel keeps Configuro focused on the work that matters after launch:
              reviewing incoming forms, reading the numbers, and moving each lead to the next step.
            </p>
          </div>

          <div className="admin-login-points">
            <article className="admin-login-point">
              <strong>Form inbox</strong>
              <span>Website submissions and manual leads are kept in one compact view.</span>
            </article>
            <article className="admin-login-point">
              <strong>Statistics</strong>
              <span>See new leads, active conversations, weekly activity, and source counts quickly.</span>
            </article>
            <article className="admin-login-point">
              <strong>Interactions</strong>
              <span>Update lead statuses as conversations move from new to reviewing, scheduled, or archived.</span>
            </article>
          </div>
        </section>

        <section className="glass-card admin-login-card">
          <div className="admin-login-card-head">
            <span className="metric-label">Sign in</span>
            <h2>Admin panel login</h2>
            <p>Enter the admin username and password to continue.</p>
          </div>

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <label className="form-field">
              Username
              <input
                type="text"
                value={form.username}
                placeholder="Enter username"
                onChange={(event) => updateField("username", event.target.value)}
                autoComplete="username"
                autoFocus
                required
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
                required
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

            <button className="primary-button admin-login-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Open admin panel"}
            </button>
          </form>

          <div className="admin-login-note">
            <strong>Direct admin access</strong>
            <p>This login uses the fixed admin credentials configured for this site.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminLogin;
