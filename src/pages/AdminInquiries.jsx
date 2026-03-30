import { useMemo, useState } from "react";
import AdminShell from "../components/AdminShell";
import { readInquiries, updateInquiryStatus } from "../admin/inquiries";
import { SOURCE_LABELS, STATUS_OPTIONS, formatDate } from "../admin/adminConfig";

function AdminInquiries() {
  const [filter, setFilter] = useState("all");
  const [inquiries, setInquiries] = useState(() => readInquiries());

  const visibleInquiries = useMemo(() => (
    filter === "all" ? inquiries : inquiries.filter((inquiry) => inquiry.status === filter)
  ), [filter, inquiries]);

  const statusCounts = useMemo(() => ({
    new: inquiries.filter((item) => item.status === "new").length,
    reviewing: inquiries.filter((item) => item.status === "reviewing").length,
    scheduled: inquiries.filter((item) => item.status === "scheduled").length,
    archived: inquiries.filter((item) => item.status === "archived").length,
  }), [inquiries]);

  const handleStatusChange = (inquiryId, status) => {
    setInquiries(updateInquiryStatus(inquiryId, status));
  };

  return (
    <AdminShell
      eyebrow="Lead inbox"
      title="Review project inquiries in one place."
      description="This page is only for inbound leads, so it is easier to scan, sort by status, and update next steps."
      badges={[
        { label: `${statusCounts.new} new`, tone: "new" },
        { label: `${visibleInquiries.length} visible`, tone: "reviewing" },
      ]}
    >
      <section className="admin-section">
        <div className="admin-shortcut-grid">
          <article className="glass-card admin-shortcut-card">
            <span className="metric-label">New</span>
            <h3>{statusCounts.new}</h3>
            <p>Fresh enquiries waiting for the first review.</p>
          </article>

          <article className="glass-card admin-shortcut-card">
            <span className="metric-label">Reviewing</span>
            <h3>{statusCounts.reviewing}</h3>
            <p>Leads that are being qualified or checked internally.</p>
          </article>

          <article className="glass-card admin-shortcut-card">
            <span className="metric-label">Scheduled</span>
            <h3>{statusCounts.scheduled}</h3>
            <p>Leads with a next step already planned.</p>
          </article>
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-head">
          <div>
            <span className="metric-label">Status filter</span>
            <h3>Inquiry list</h3>
            <p>Switch status filters to focus on new, active, or archived conversations.</p>
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
                    {" · "}
                    {inquiry.email || "No email provided"}
                    {" · "}
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

              {inquiry.designPreviewPng || inquiry.templateDesign ? (
                <div className="admin-inquiry-design">
                  {inquiry.designPreviewPng ? (
                    <img
                      className="admin-inquiry-thumb"
                      src={inquiry.designPreviewPng}
                      alt={inquiry.templateDesign?.presetLabel ?? "Template preview"}
                    />
                  ) : null}

                  <div className="admin-inquiry-design-meta">
                    {inquiry.templateDesign?.presetLabel ? (
                      <p>
                        <strong>Preset:</strong> {inquiry.templateDesign.presetLabel}
                      </p>
                    ) : null}
                    {inquiry.templateDesign?.paletteLabel ? (
                      <p>
                        <strong>Palette:</strong> {inquiry.templateDesign.paletteLabel}
                      </p>
                    ) : null}
                    {inquiry.templateDesign?.layoutLabel ? (
                      <p>
                        <strong>Layout:</strong> {inquiry.templateDesign.layoutLabel}
                      </p>
                    ) : null}
                    {inquiry.templateDesign?.shapeLabel ? (
                      <p>
                        <strong>Shape:</strong> {inquiry.templateDesign.shapeLabel}
                      </p>
                    ) : null}
                    {inquiry.templateDesign?.surfaceLabel ? (
                      <p>
                        <strong>Surface:</strong> {inquiry.templateDesign.surfaceLabel}
                      </p>
                    ) : null}
                    {inquiry.templateDesign?.densityLabel ? (
                      <p>
                        <strong>Density:</strong> {inquiry.templateDesign.densityLabel}
                      </p>
                    ) : null}
                    {inquiry.templateDesign?.previewMode ? (
                      <p>
                        <strong>Preview:</strong> {inquiry.templateDesign.previewMode}
                      </p>
                    ) : null}
                    {Array.isArray(inquiry.templateDesign?.sections) && inquiry.templateDesign.sections.length ? (
                      <p>
                        <strong>Sections:</strong>{" "}
                        {inquiry.templateDesign.sections.map((section) => (
                          `${section.label}${section.width ? ` (${section.width} · ${section.emphasis} · ${section.columns} · ${section.alignment})` : ""}`
                        )).join(", ")}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {(inquiry.goals.length || inquiry.deliverables.length || inquiry.projectType || inquiry.productStage) ? (
                <div className="admin-chip-row">
                  {inquiry.projectType ? <span className="chip">{inquiry.projectType}</span> : null}
                  {inquiry.productStage ? <span className="chip">{inquiry.productStage}</span> : null}
                  {inquiry.goals.map((goal) => <span className="chip" key={goal}>{goal}</span>)}
                  {inquiry.deliverables.map((deliverable) => <span className="chip" key={deliverable}>{deliverable}</span>)}
                </div>
              ) : null}
            </article>
          )) : (
            <div className="glass-card admin-empty-state">
              <strong>No inquiries in this filter</strong>
              <p>New submissions from the public forms will appear here automatically.</p>
            </div>
          )}
        </div>
      </section>
    </AdminShell>
  );
}

export default AdminInquiries;
