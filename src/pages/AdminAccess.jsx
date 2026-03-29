import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../admin/AdminAuthContext";
import { useContentAdmin } from "../admin/ContentAdminContext";
import { readInquiries } from "../admin/inquiries";
import { readAllMediaAssets } from "../admin/mediaStore";
import AdminShell from "../components/AdminShell";
import { SITE_PAGE_RECORDS, formatDate } from "../admin/adminConfig";

function AdminAccess() {
  const { session, credentialConfig } = useAdminAuth();
  const { overrides } = useContentAdmin();
  const [assetCount, setAssetCount] = useState(0);
  const inquiries = useMemo(() => readInquiries(), []);

  useEffect(() => {
    let isMounted = true;

    const loadAssets = async () => {
      const records = await readAllMediaAssets();
      if (isMounted) {
        setAssetCount(records.length);
      }
    };

    loadAssets();

    return () => {
      isMounted = false;
    };
  }, []);

  const overrideCount = useMemo(() => (
    Object.values(overrides).reduce((count, localeOverride) => count + Object.keys(localeOverride ?? {}).length, 0)
  ), [overrides]);

  return (
    <AdminShell
      eyebrow="Access and setup"
      title="See how this admin is organized."
      description="This page explains the current storage model, session details, and which public pages are covered by the admin workspace."
      badges={[
        { label: `${overrideCount} custom sections`, tone: "scheduled" },
        { label: `${assetCount} media files`, tone: "reviewing" },
      ]}
    >
      <section className="admin-section">
        <div className="admin-access-grid">
          <article className="glass-card admin-access-card">
            <h4>Current session</h4>
            <p>Signed in as {session?.email}. Active since {formatDate(session?.loginAt)}.</p>
          </article>

          <article className="glass-card admin-access-card">
            <h4>Credential source</h4>
            <p>
              {credentialConfig.usingFallbackCredentials
                ? "Using the local default credential set inside the project."
                : "Using custom admin credentials from Vite environment variables."}
            </p>
          </article>

          <article className="glass-card admin-access-card">
            <h4>Storage model</h4>
            <p>
              Content overrides, inquiry updates, and uploaded media are currently stored in the browser for local management.
            </p>
          </article>
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-shortcut-grid">
          <article className="glass-card admin-shortcut-card">
            <span className="metric-label">Overview</span>
            <h3>Start here</h3>
            <p>Use the dashboard to see what needs attention first.</p>
          </article>

          <article className="glass-card admin-shortcut-card">
            <span className="metric-label">Content</span>
            <h3>One section at a time</h3>
            <p>Use the Content page for focused edits and the Templates page for bulk edits.</p>
          </article>

          <article className="glass-card admin-shortcut-card">
            <span className="metric-label">Ops status</span>
            <h3>{inquiries.length} inquiries tracked</h3>
            <p>Lead status updates and slot media uploads are kept in their own pages.</p>
          </article>
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-head">
          <div>
            <span className="metric-label">Site coverage</span>
            <h3>Public pages managed here</h3>
            <p>Each page has content and media touchpoints available from the new admin navigation.</p>
          </div>
        </div>

        <div className="admin-card-stack">
          {SITE_PAGE_RECORDS.map((page) => (
            <article className="glass-card admin-coverage-row" key={page.name}>
              <div>
                <strong>{page.name}</strong>
                <p>{page.focus}</p>
              </div>
              <div className="admin-coverage-meta">
                <span>{page.owner}</span>
                <span>{page.slotCount} media placements</span>
                <Link to={page.route}>Open public page</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}

export default AdminAccess;
