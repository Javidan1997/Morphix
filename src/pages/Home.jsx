import { useState } from "react";
import { Link } from "react-router-dom";
import MediaSlotsSection from "../components/MediaSlotsSection";
import { createInquiry } from "../admin/inquiries";

function Home({ content }) {
  const {
    hero,
    valueProps,
    servicesPreview,
    portfolioPreview,
    trust,
    homeContact,
    homeCta,
    homeMediaGallery,
  } = content;
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const updateForm = (field, value) => {
    setSent(false);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <main className="page-home">
      {/* Hero */}
      <section className="hero-section">
        <div className="container hero-container">
          <h1 className="hero-headline reveal">{hero.headline}</h1>
          <p className="hero-subline reveal">{hero.subline}</p>
          <div className="hero-actions reveal">
            <Link className="primary-button" to="/contact">
              {hero.primaryCta}
            </Link>
            <Link className="secondary-button" to="/work">
              {hero.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="section-block value-section">
        <div className="container">
          <div className="eyebrow reveal">{valueProps.eyebrow}</div>
          <div className="value-grid">
            {valueProps.items.map((item, i) => (
              <article className="value-card reveal" key={item.title} style={{ transitionDelay: `${i * 0.08}s` }}>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section-block services-preview-section">
        <div className="container">
          <div className="section-head reveal">
            <div className="eyebrow">{servicesPreview.eyebrow}</div>
            <h2>{servicesPreview.title}</h2>
          </div>
          <div className="services-preview-grid">
            {servicesPreview.items.map((item, i) => (
              <article className="service-preview-card reveal" key={item.title} style={{ transitionDelay: `${i * 0.08}s` }}>
                <span className="service-number">0{i + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
          <div className="section-cta reveal">
            <Link className="secondary-button" to="/services">
              {servicesPreview.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="section-block portfolio-preview-section">
        <div className="container">
          <div className="section-head reveal">
            <div className="eyebrow">{portfolioPreview.eyebrow}</div>
            <h2>{portfolioPreview.title}</h2>
          </div>
          <div className="portfolio-preview-grid">
            {portfolioPreview.projects.map((project, i) => (
              <article className="portfolio-preview-card reveal" key={project.name} style={{ transitionDelay: `${i * 0.1}s` }}>
                <span className="portfolio-type">{project.type}</span>
                <h3>{project.name}</h3>
                <p>{project.result}</p>
              </article>
            ))}
          </div>
          <div className="section-cta reveal">
            <Link className="secondary-button" to="/work">
              {portfolioPreview.cta}
            </Link>
          </div>
        </div>
      </section>

      <MediaSlotsSection copy={homeMediaGallery} />

      {/* Trust / Metrics */}
      <section className="section-block trust-section">
        <div className="container">
          <div className="eyebrow reveal">{trust.eyebrow}</div>
          <div className="trust-grid">
            {trust.items.map((item, i) => (
              <div className="trust-item reveal" key={item.label} style={{ transitionDelay: `${i * 0.1}s` }}>
                <strong>{item.metric}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inline Contact Form */}
      <section className="section-block home-contact-section">
        <div className="container">
          <div className="home-contact-layout">
            <div className="home-contact-copy reveal">
              <div className="eyebrow">{homeContact.eyebrow}</div>
              <h2>{homeContact.title}</h2>
              <p>{homeContact.copy}</p>
            </div>
            <form
              className="glass-card home-contact-form reveal"
              style={{ transitionDelay: "0.1s" }}
              onSubmit={(e) => {
                e.preventDefault();
                createInquiry({
                  source: "home-form",
                  fullName: form.name,
                  email: form.email,
                  brief: form.message,
                });
                setSent(true);
              }}
            >
              {sent ? (
                <div className="contact-success">
                  <strong>{homeContact.successTitle}</strong>
                  <p>{homeContact.successCopy}</p>
                </div>
              ) : (
                <>
                  <label className="form-field">
                    {homeContact.fields.name.label}
                    <input
                      type="text"
                      value={form.name}
                      placeholder={homeContact.fields.name.placeholder}
                      onChange={(e) => updateForm("name", e.target.value)}
                    />
                  </label>
                  <label className="form-field">
                    {homeContact.fields.email.label}
                    <input
                      type="email"
                      value={form.email}
                      placeholder={homeContact.fields.email.placeholder}
                      onChange={(e) => updateForm("email", e.target.value)}
                    />
                  </label>
                  <label className="form-field">
                    {homeContact.fields.message.label}
                    <textarea
                      rows="3"
                      value={form.message}
                      placeholder={homeContact.fields.message.placeholder}
                      onChange={(e) => updateForm("message", e.target.value)}
                    />
                  </label>
                  <button className="primary-button submit-button" type="submit">
                    {homeContact.submit}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-block cta-section">
        <div className="container cta-container reveal">
          <h2>{homeCta.headline}</h2>
          <p>{homeCta.copy}</p>
          <Link className="primary-button" to="/contact">
            {homeCta.button}
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
