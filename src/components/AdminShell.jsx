import { Link, NavLink } from "react-router-dom";
import logoUrl from "../../branding/morphix-logo.svg";
import { useAdminAuth } from "../admin/AdminAuthContext";
import { ADMIN_NAV_ITEMS, formatDate } from "../admin/adminConfig";

function AdminShell({
  eyebrow = "Configuro Admin",
  title,
  description,
  badges = [],
  topbarActions = null,
  children,
}) {
  const { session, logout } = useAdminAuth();

  return (
    <main className="admin-dashboard-page">
      <div className="admin-dashboard-shell">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-brand">
            <div className="admin-sidebar-brand-head">
              <img src={logoUrl} alt="Configuro" />
              <span className="chip">Admin</span>
            </div>
            <h1>Configuro admin</h1>
            <p>Cleaner, smaller pages for content, templates, media, and inquiries.</p>
          </div>

          <nav className="admin-sidebar-nav" aria-label="Admin navigation">
            {ADMIN_NAV_ITEMS.map((item) => (
              <NavLink
                className={({ isActive }) => `admin-sidebar-link ${isActive ? "is-active" : ""}`}
                key={item.to}
                to={item.to}
              >
                <span>{item.label}</span>
                <small>{item.helper}</small>
              </NavLink>
            ))}
          </nav>

          <div className="admin-sidebar-session">
            <span className="metric-label">Signed in as</span>
            <strong>{session?.name}</strong>
            <p>{session?.email}</p>
            <span>Session started {formatDate(session?.loginAt)}</span>
          </div>

          <div className="admin-sidebar-actions">
            <Link className="secondary-button" to="/">
              View website
            </Link>
            <Link className="secondary-button" to="/playground">
              Open Playground
            </Link>
            <button className="primary-button" type="button" onClick={logout}>
              Log out
            </button>
          </div>
        </aside>

        <div className="admin-main">
          <header className="admin-topbar">
            <div className="admin-topbar-copy">
              <span className="metric-label">{eyebrow}</span>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>

            <div className="admin-topbar-meta">
              {badges.map((badge) => (
                <span className={`admin-status-badge is-${badge.tone || "scheduled"}`} key={badge.label}>
                  {badge.label}
                </span>
              ))}
              {topbarActions}
            </div>
          </header>

          {children}
        </div>
      </div>
    </main>
  );
}

export default AdminShell;
