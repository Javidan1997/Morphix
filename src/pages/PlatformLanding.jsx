import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createInquiry } from "../admin/inquiries";
import { platformOrder, platformPages } from "../data/platformPages";
import { projects } from "../data/projects";

const projectSlugs = ["pergolade", "glass-group-operations", "signal-lead-orchestrator"];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M11 6l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlatformMark({ config }) {
  if (config.slug === "shopify") {
    return (
      <div className="platform-storefront" aria-hidden="true">
        <div className="store-browser">
          <div className="store-bar"><i /><i /><i /><span>Product / Studio Series</span></div>
          <div className="store-product">
            <div className="store-product-visual"><div className="store-object" /></div>
            <div className="store-product-copy">
              <span>Studio collection</span><strong>Modular outdoor system</strong>
              <div className="store-lines"><i /><i /><i /></div>
              <button type="button" tabIndex="-1">Add to cart</button>
            </div>
          </div>
        </div>
        <div className="store-mobile"><span>Checkout</span><div /><div /><strong>Continue</strong></div>
        <div className="store-note note-a">Flexible sections</div>
        <div className="store-note note-b">Lean theme code</div>
      </div>
    );
  }

  return (
    <div className={`platform-diagram platform-diagram-${config.slug}`} aria-hidden="true">
      <div className="proposal-sheet">
        <span>{config.platform}</span>
        <strong>{config.slug === "fiverr" ? "Custom offer" : config.slug === "toptal" ? "Delivery brief" : "Your project"}</strong>
        <i /><i /><i /><i />
      </div>
      <div className="diagram-path" />
      <div className="diagram-stages">
        {config.process.map((step) => (
          <div className="diagram-stage" key={step.title}>
            <b>{step.mark}</b><span>{step.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlatformLanding({ platform }) {
  const config = platformPages[platform];
  const [form, setForm] = useState({ name: "", email: "", budget: "", brief: "" });
  const [sent, setSent] = useState(false);
  const selectedProjects = useMemo(
    () => projectSlugs.map((slug) => projects.find((project) => project.slug === slug)).filter(Boolean),
    [],
  );

  const update = (key, value) => {
    setSent(false);
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    createInquiry({
      source: `${config.slug}-landing-page`,
      fullName: form.name,
      email: form.email,
      budget: form.budget,
      brief: `[${config.platform} landing page] ${form.brief}`,
    });
    setSent(true);
  };

  return (
    <main className={`platform-page platform-theme-${config.theme}`}>
      <section className="platform-hero">
        <div className="container platform-hero-grid">
          <div className="platform-hero-copy reveal">
            <h1>{config.headline}</h1>
            <p>{config.lede}</p>
            <div className="platform-actions">
              <a className="platform-primary" href="#project-brief">{config.primaryCta}<ArrowIcon /></a>
              <a className="platform-secondary" href="#relevant-work">{config.secondaryCta}<ArrowIcon /></a>
            </div>
          </div>
          <PlatformMark config={config} />
        </div>
      </section>

      <section className="platform-proof" aria-label={`${config.platform} project strengths`}>
        <div className="container platform-proof-grid">
          {config.proof.map((item, index) => (
            <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></div>
          ))}
        </div>
      </section>

      <section className="platform-section platform-process">
        <div className="container">
          <div className="platform-section-head reveal">
            <h2>{config.processTitle}</h2>
            <p>{config.processIntro}</p>
          </div>
          <div className="platform-process-track">
            {config.process.map((step, index) => (
              <article className="platform-process-step reveal" key={step.title} style={{ transitionDelay: `${index * 0.06}s` }}>
                <span>{step.mark}</span><h3>{step.title}</h3><p>{step.output}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="platform-section platform-fit">
        <div className="container platform-fit-grid">
          <div className="platform-fit-intro reveal"><h2>{config.fitTitle}</h2><p>{config.fitCopy}</p></div>
          <div className="platform-fit-list">
            {config.fit.map(([title, copy], index) => (
              <article className="reveal" key={title} style={{ transitionDelay: `${index * 0.07}s` }}>
                <span>0{index + 1}</span><div><h3>{title}</h3><p>{copy}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="platform-section platform-services">
        <div className="container platform-services-grid">
          <div className="platform-services-title reveal">
            <h2>{config.servicesTitle}</h2>
            <Link to="/services">Explore all services <ArrowIcon /></Link>
          </div>
          <div className="platform-services-list">
            {config.services.map(([title, copy], index) => (
              <article className="reveal" key={title} style={{ transitionDelay: `${index * 0.05}s` }}>
                <span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {config.migration ? (
        <section className="platform-migration">
          <div className="container platform-migration-grid">
            <div><h2>Migrate with confidence.</h2><p>Move the business, preserve the signals, validate the new store.</p></div>
            <div className="migration-flow">
              {config.migration.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        </section>
      ) : null}

      <section className="platform-section platform-work" id="relevant-work">
        <div className="container">
          <div className="platform-section-head platform-section-head-wide reveal">
            <h2>Selected work, chosen for relevance.</h2>
            <p>Complex products need both technical clarity and visual conviction. These projects show the range we bring to one engagement.</p>
          </div>
          <div className="platform-work-rail">
            {selectedProjects.map((project, index) => {
              const image = project.images?.[0]?.src || project.coverImage;
              return (
                <Link className="platform-work-item reveal" to="/work" key={project.slug} style={{ transitionDelay: `${index * 0.08}s` }}>
                  <div className="platform-work-media"><img src={image} alt={project.name} /></div>
                  <span>{project.type}</span><h3>{project.name}</h3><p>{project.outcome || project.summary}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="platform-brief" id="project-brief">
        <div className="container platform-brief-grid">
          <div className="platform-brief-copy reveal"><h2>{config.briefTitle}</h2><p>{config.briefCopy}</p></div>
          <form className="platform-brief-form reveal" onSubmit={submit}>
            {sent ? (
              <div className="platform-success" role="status"><strong>Brief received.</strong><p>We’ll review it and reply with the most useful next step.</p></div>
            ) : (
              <>
                <label>Name<input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" /></label>
                <label>Email<input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@company.com" /></label>
                <label>Budget range<select required value={form.budget} onChange={(e) => update("budget", e.target.value)}><option value="">Select range</option><option>$2k–$5k</option><option>$5k–$15k</option><option>$15k–$40k</option><option>$40k+</option></select></label>
                <label className="platform-field-wide">Project brief<textarea required rows="4" value={form.brief} onChange={(e) => update("brief", e.target.value)} placeholder="Goal, current state, key deliverables, timeline and relevant links" /></label>
                <button className="platform-submit" type="submit">Get a scoped reply <ArrowIcon /></button>
              </>
            )}
          </form>
        </div>
      </section>

      <section className="platform-section platform-faq">
        <div className="container platform-faq-grid">
          <div><h2>Questions before we start.</h2><p>Clear answers now make the first working session much more useful.</p></div>
          <div className="platform-faq-list">
            {config.faqs.map(([question, answer]) => (
              <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>
            ))}
          </div>
        </div>
      </section>

      <section className="platform-related">
        <div className="container">
          <p>Choose the page that matches how you found us.</p>
          <div>
            {platformOrder.filter((slug) => slug !== config.slug).map((slug) => (
              <Link to={`/${slug}`} key={slug}>{platformPages[slug].platform}</Link>
            ))}
          </div>
          <small>{config.disclaimer}</small>
        </div>
      </section>
    </main>
  );
}

export default PlatformLanding;
