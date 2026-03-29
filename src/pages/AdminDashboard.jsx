import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useContentAdmin } from "../admin/ContentAdminContext";
import { readInquiries } from "../admin/inquiries";
import { readAllMediaAssets } from "../admin/mediaStore";
import AdminShell from "../components/AdminShell";
import { SITE_PAGE_RECORDS } from "../admin/adminConfig";

function AdminDashboard() {
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

  const metrics = [
    {
      label: "New inquiries",
      value: inquiries.filter((item) => item.status === "new").length,
      helper: "Fresh submissions waiting for review",
    },
    {
      label: "Custom sections",
      value: overrideCount,
      helper: "Saved content overrides across all locales",
    },
    {
      label: "Uploaded assets",
      value: assetCount,
      helper: "Images and videos available for page slots",
    },
    {
      label: "Admin pages",
      value: 6,
      helper: "Smaller pages instead of one long dashboard",
    },
  ];

  const quickActions = [
    {
      to: "/admin/content",
      title: "Edit content",
      copy: "Choose a page, choose a locale, and edit one section at a time.",
    },
    {
      to: "/admin/templates",
      title: "Batch with Excel",
      copy: "Download a CSV template, update the values in Excel, and import in one step.",
    },
    {
      to: "/admin/media",
      title: "Manage media",
      copy: "Upload one strong image or video for each public media placement.",
    },
    {
      to: "/admin/inquiries",
      title: "Review inquiries",
      copy: "Check new project leads without scrolling past unrelated admin tools.",
    },
  ];

  return (
    <AdminShell
      eyebrow="Overview"
      title="Admin, now split into clearer pages."
      description="Use this overview as your starting point. From here you can jump into content, batch templates, media, inquiries, or access without working through one long screen."
      badges={[
        { label: "Multipage admin", tone: "scheduled" },
        { label: "Playground live", tone: "reviewing" },
      ]}
    >
      <section className="admin-section">
        <div className="admin-metric-grid">
          {metrics.map((metric) => (
            <article className="glass-card admin-metric-card" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <p>{metric.helper}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-head">
          <div>
            <span className="metric-label">Quick actions</span>
            <h3>Choose the job you want to do</h3>
            <p>Each task now has its own page, so the admin is easier to understand and faster to use.</p>
          </div>
        </div>

        <div className="admin-shortcut-grid">
          {quickActions.map((action) => (
            <Link className="glass-card admin-shortcut-card admin-shortcut-card-link" key={action.to} to={action.to}>
              <span className="metric-label">Open</span>
              <h3>{action.title}</h3>
              <p>{action.copy}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-head">
          <div>
            <span className="metric-label">Public pages</span>
            <h3>What the website currently covers</h3>
            <p>These pages can now be managed from dedicated admin screens instead of one mixed dashboard.</p>
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
                <Link to={page.route}>Open page</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}

export default AdminDashboard;
