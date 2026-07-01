import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminShell from "../components/AdminShell";
import { useAdminAuth } from "../admin/AdminAuthContext";
import {
  SOURCE_LABELS,
  STATUS_OPTIONS,
  formatDate,
} from "../admin/adminConfig";
import {
  createInquiryAsync,
  readInquiries,
  readInquiriesAsync,
  updateInquiryStatus,
  updateInquiryStatusAsync,
} from "../admin/inquiries";

const VIEW_COPY = {
  forms: {
    eyebrow: "Forms",
    title: "Project enquiry desk",
    description: "Add manual leads and review every form submission from the public website in one calm workspace.",
  },
  statistics: {
    eyebrow: "Statistics",
    title: "Lead performance",
    description: "Track enquiry volume, pipeline status, and the forms that are creating the most conversations.",
  },
  interactions: {
    eyebrow: "Interactions",
    title: "Follow-up pipeline",
    description: "Update statuses, filter conversations, and keep every incoming project moving toward a next step.",
  },
};

const VIEW_TABS = [
  { id: "forms", label: "Forms", path: "/admin/forms" },
  { id: "statistics", label: "Statistics", path: "/admin/statistics" },
  { id: "interactions", label: "Interactions", path: "/admin/interactions" },
];

const INITIAL_MANUAL_LEAD = {
  fullName: "",
  email: "",
  company: "",
  website: "",
  productName: "",
  budget: "",
  timeline: "",
  brief: "",
};

function getInquiryDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date(0) : date;
}

function AdminDashboard({ view = "forms" }) {
  const activeView = VIEW_COPY[view] ? view : "forms";
  const navigate = useNavigate();
  const { session } = useAdminAuth();
  const [filter, setFilter] = useState("all");
  const [inquiries, setInquiries] = useState(() => readInquiries());
  const [manualLead, setManualLead] = useState(INITIAL_MANUAL_LEAD);
  const [formMessage, setFormMessage] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(session?.accessToken));
  const [adminError, setAdminError] = useState("");

  const now = Date.now();
  const weekAgo = now - (7 * 24 * 60 * 60 * 1000);

  const statusCounts = useMemo(() => ({
    new: inquiries.filter((item) => item.status === "new").length,
    reviewing: inquiries.filter((item) => item.status === "reviewing").length,
    scheduled: inquiries.filter((item) => item.status === "scheduled").length,
    archived: inquiries.filter((item) => item.status === "archived").length,
  }), [inquiries]);

  const sourceCounts = useMemo(() => (
    inquiries.reduce((counts, inquiry) => {
      const source = inquiry.source || "website";
      return {
        ...counts,
        [source]: (counts[source] || 0) + 1,
      };
    }, {})
  ), [inquiries]);

  const visibleInquiries = useMemo(() => (
    filter === "all"
      ? inquiries
      : inquiries.filter((inquiry) => inquiry.status === filter)
  ), [filter, inquiries]);

  const metrics = [
    {
      label: "Total forms",
      value: inquiries.length,
      helper: "All saved project enquiries",
    },
    {
      label: "New",
      value: statusCounts.new,
      helper: "Needs first response",
    },
    {
      label: "In progress",
      value: statusCounts.reviewing + statusCounts.scheduled,
      helper: "Reviewing or scheduled",
    },
    {
      label: "This week",
      value: inquiries.filter((item) => getInquiryDate(item.receivedAt).getTime() >= weekAgo).length,
      helper: "Recent form activity",
    },
  ];

  const resetManualLead = () => {
    setManualLead(INITIAL_MANUAL_LEAD);
  };

  const refreshInquiries = async () => {
    setIsLoading(true);
    setAdminError("");
    try {
      const nextInquiries = await readInquiriesAsync(session);
      setInquiries(nextInquiries);
    } catch (error) {
      setAdminError(error instanceof Error ? error.message : "Could not load inquiries.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshInquiries();
  }, [session?.accessToken]);

  const updateManualLead = (field, value) => {
    setFormMessage("");
    setManualLead((current) => ({ ...current, [field]: value }));
  };

  const handleManualLeadSubmit = async (event) => {
    event.preventDefault();

    if (!manualLead.fullName.trim() || !manualLead.email.trim()) {
      setFormMessage("Name and email are required.");
      return;
    }

    try {
      await createInquiryAsync({
        ...manualLead,
        source: "manual-entry",
        goals: [],
        deliverables: [],
      }, session);

      await refreshInquiries();
      resetManualLead();
      setFormMessage("Lead added to the form inbox.");
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : "Could not add lead.");
    }
  };

  const handleStatusChange = async (inquiryId, status) => {
    const previousInquiries = inquiries;
    setInquiries((current) => current.map((inquiry) => (
      inquiry.id === inquiryId ? { ...inquiry, status } : inquiry
    )));

    try {
      const updatedInquiry = await updateInquiryStatusAsync(inquiryId, status, session);
      if (updatedInquiry) {
        setInquiries((current) => current.map((inquiry) => (
          inquiry.id === inquiryId ? updatedInquiry : inquiry
        )));
      } else if (!session?.accessToken) {
        setInquiries(updateInquiryStatus(inquiryId, status));
      }
    } catch (error) {
      setInquiries(previousInquiries);
      setAdminError(error instanceof Error ? error.message : "Could not update status.");
    }
  };

  return (
    <AdminShell
      eyebrow={VIEW_COPY[activeView].eyebrow}
      title={VIEW_COPY[activeView].title}
      description={VIEW_COPY[activeView].description}
      badges={[
        { label: `${inquiries.length} forms`, tone: "scheduled" },
        { label: `${statusCounts.new} new`, tone: statusCounts.new ? "new" : "archived" },
      ]}
    >
      <section className="admin-section">
        {adminError ? <p className="admin-form-error">{adminError}</p> : null}
        <div className="admin-focus-tabs" aria-label="Admin sections">
          {VIEW_TABS.map((tab) => (
            <button
              className={`admin-focus-tab ${activeView === tab.id ? "is-active" : ""}`}
              key={tab.id}
              type="button"
              onClick={() => navigate(tab.path)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="admin-metric-grid">
          {metrics.map((metric) => (
            <article className="glass-card admin-metric-card" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <p>{metric.helper}</p>
            </article>
          ))}
        </div>
        {isLoading ? <p className="admin-form-feedback">Loading latest inquiries...</p> : null}
      </section>

      {activeView === "forms" ? (
        <section className="admin-section">
          <div className="admin-ops-grid">
            <article className="glass-card admin-form-panel">
              <div className="admin-section-head">
                <div>
                  <span className="metric-label">Manual form</span>
                  <h3>Add a project lead</h3>
                  <p>Use this when a lead comes from WhatsApp, email, phone, or a sales conversation.</p>
                </div>
              </div>

              <form className="admin-lead-form" onSubmit={handleManualLeadSubmit}>
                <div className="admin-form-row">
                  <label className="form-field">
                    Full name
                    <input
                      type="text"
                      value={manualLead.fullName}
                      placeholder="Client name"
                      onChange={(event) => updateManualLead("fullName", event.target.value)}
                    />
                  </label>
                  <label className="form-field">
                    Email
                    <input
                      type="email"
                      value={manualLead.email}
                      placeholder="client@company.com"
                      onChange={(event) => updateManualLead("email", event.target.value)}
                    />
                  </label>
                </div>

                <div className="admin-form-row">
                  <label className="form-field">
                    Company
                    <input
                      type="text"
                      value={manualLead.company}
                      placeholder="Company or brand"
                      onChange={(event) => updateManualLead("company", event.target.value)}
                    />
                  </label>
                  <label className="form-field">
                    Website
                    <input
                      type="url"
                      value={manualLead.website}
                      placeholder="https://"
                      onChange={(event) => updateManualLead("website", event.target.value)}
                    />
                  </label>
                </div>

                <div className="admin-form-row">
                  <label className="form-field">
                    Product
                    <input
                      type="text"
                      value={manualLead.productName}
                      placeholder="Configurator, landing page, 3D demo..."
                      onChange={(event) => updateManualLead("productName", event.target.value)}
                    />
                  </label>
                  <label className="form-field">
                    Budget
                    <input
                      type="text"
                      value={manualLead.budget}
                      placeholder="Budget range"
                      onChange={(event) => updateManualLead("budget", event.target.value)}
                    />
                  </label>
                </div>

                <label className="form-field">
                  Timeline
                  <input
                    type="text"
                    value={manualLead.timeline}
                    placeholder="Launch window or deadline"
                    onChange={(event) => updateManualLead("timeline", event.target.value)}
                  />
                </label>

                <label className="form-field">
                  Brief
                  <textarea
                    value={manualLead.brief}
                    placeholder="What does the client want to build?"
                    rows="5"
                    onChange={(event) => updateManualLead("brief", event.target.value)}
                  />
                </label>

                {formMessage ? <p className="admin-form-feedback">{formMessage}</p> : null}

                <div className="admin-form-actions">
                  <button className="secondary-button" type="button" onClick={resetManualLead}>
                    Clear
                  </button>
                  <button className="primary-button" type="submit">
                    Add lead
                  </button>
                </div>
              </form>
            </article>

            <article className="glass-card admin-form-panel">
              <div className="admin-section-head">
                <div>
                  <span className="metric-label">Recent forms</span>
                  <h3>Latest submissions</h3>
                  <p>The newest website and manual leads appear here first.</p>
                </div>
              </div>

              <div className="admin-mini-list">
                {inquiries.slice(0, 5).map((inquiry) => (
                  <div className="admin-mini-row" key={inquiry.id}>
                    <div>
                      <strong>{inquiry.fullName || "Unnamed lead"}</strong>
                      <span>{inquiry.email || "No email"} - {formatDate(inquiry.receivedAt)}</span>
                    </div>
                    <span className={`admin-status-badge is-${inquiry.status}`}>{inquiry.status}</span>
                  </div>
                ))}

                {!inquiries.length ? (
                  <div className="admin-empty-state">
                    <strong>No forms yet</strong>
                    <p>Public form submissions and manually added leads will appear here.</p>
                  </div>
                ) : null}
              </div>
            </article>
          </div>
        </section>
      ) : null}

      {activeView === "statistics" ? (
        <section className="admin-section">
          <div className="admin-statistics-grid">
            <article className="glass-card admin-stat-panel">
              <span className="metric-label">Pipeline</span>
              <h3>Status breakdown</h3>
              <div className="admin-funnel-list">
                {STATUS_OPTIONS.filter((option) => option.value !== "all").map((option) => {
                  const count = statusCounts[option.value] ?? 0;
                  const percent = inquiries.length ? Math.round((count / inquiries.length) * 100) : 0;

                  return (
                    <div className="admin-funnel-row" key={option.value}>
                      <div>
                        <strong>{option.label}</strong>
                        <span>{count} lead{count === 1 ? "" : "s"}</span>
                      </div>
                      <div className="admin-funnel-meter" aria-label={`${option.label} ${percent}%`}>
                        <span style={{ width: `${percent}%` }} />
                      </div>
                      <em>{percent}%</em>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="glass-card admin-stat-panel">
              <span className="metric-label">Source</span>
              <h3>Where forms come from</h3>
              <div className="admin-source-list">
                {Object.entries(sourceCounts).length ? Object.entries(sourceCounts).map(([source, count]) => (
                  <div className="admin-source-row" key={source}>
                    <strong>{SOURCE_LABELS[source] ?? source}</strong>
                    <span>{count}</span>
                  </div>
                )) : (
                  <div className="admin-empty-state">
                    <strong>No source data yet</strong>
                    <p>Sources are counted once forms are submitted.</p>
                  </div>
                )}
              </div>
            </article>
          </div>
        </section>
      ) : null}

      {activeView === "interactions" ? (
        <section className="admin-section">
          <div className="admin-section-head">
            <div>
              <span className="metric-label">Pipeline control</span>
              <h3>Move every lead to the next step</h3>
              <p>Filter by status, scan the brief, and update the interaction state after each follow-up.</p>
            </div>

            <div className="admin-filter-row">
              {STATUS_OPTIONS.map((option) => (
                <button
                  className={`admin-filter-chip ${filter === option.value ? "is-active" : ""}`}
                  key={option.value}
                  type="button"
                  onClick={() => setFilter(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="admin-card-stack">
            {visibleInquiries.length ? visibleInquiries.map((inquiry) => (
              <article className="glass-card admin-inquiry-card" key={inquiry.id}>
                <div className="admin-inquiry-head">
                  <div>
                    <div className="admin-inquiry-title-row">
                      <h4>{inquiry.fullName || "Unnamed lead"}</h4>
                      <span className={`admin-status-badge is-${inquiry.status}`}>{inquiry.status}</span>
                    </div>
                    <p>
                      {SOURCE_LABELS[inquiry.source] ?? inquiry.source}
                      {" - "}
                      {inquiry.email || "No email provided"}
                      {" - "}
                      {formatDate(inquiry.receivedAt)}
                    </p>
                  </div>

                  <label className="admin-select-field">
                    Status
                    <select
                      value={inquiry.status}
                      onChange={(event) => handleStatusChange(inquiry.id, event.target.value)}
                    >
                      {STATUS_OPTIONS.filter((option) => option.value !== "all").map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="admin-inquiry-meta">
                  {inquiry.company ? <span>{inquiry.company}</span> : null}
                  {inquiry.website ? <span>{inquiry.website}</span> : null}
                  {inquiry.productName ? <span>{inquiry.productName}</span> : null}
                  {inquiry.timeline ? <span>{inquiry.timeline}</span> : null}
                  {inquiry.budget ? <span>{inquiry.budget}</span> : null}
                </div>

                {inquiry.brief ? <p className="admin-inquiry-brief">{inquiry.brief}</p> : null}
              </article>
            )) : (
              <div className="glass-card admin-empty-state">
                <strong>No leads in this filter</strong>
                <p>Switch filters or add a lead from the Forms tab.</p>
              </div>
            )}
          </div>
        </section>
      ) : null}
    </AdminShell>
  );
}

export default AdminDashboard;
