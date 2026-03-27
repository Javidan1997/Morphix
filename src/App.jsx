import { useEffect, useState } from "react";
import SceneCanvas from "./components/SceneCanvas";
import ConfiguratorExperience from "./components/ConfiguratorExperience";
import {
  getInitialLanguage,
  LANGUAGE_STORAGE_KEY,
  fallbackLanguage,
  localeOptions,
  locales,
} from "./locales";
import logoUrl from "../branding/morphix-logo.svg";
import iconUrl from "../branding/morphix-icon.svg";

const DEFAULT_HERO_PRODUCT = "sofa";
const defaultHeroSelections = {
  sofa: { size: "standard", finish: "graphite", feature: "lounge", environment: "loft" },
  phone: { size: "standard", finish: "graphite", feature: "camera", environment: "studio" },
  headset: { size: "standard", finish: "carbon", feature: "gaming", environment: "stage" },
};

const contactWizardLayout = [
  { groupKeys: ["projectType", "productStage"], fieldKeys: ["company", "productName", "website"] },
  { groupKeys: ["audience", "goals"], fieldKeys: [] },
  { groupKeys: ["deliverables", "integrations", "assets"], fieldKeys: [] },
  { groupKeys: ["timeline", "budget"], fieldKeys: ["fullName", "email", "brief"] },
];

const contactSummaryKeys = [
  "projectType",
  "productStage",
  "audience",
  "goals",
  "deliverables",
  "integrations",
  "assets",
  "timeline",
  "budget",
];

const defaultContactIntake = {
  company: "",
  productName: "",
  website: "",
  fullName: "",
  email: "",
  brief: "",
  projectType: "",
  productStage: "",
  audience: [],
  goals: [],
  deliverables: [],
  integrations: [],
  assets: [],
  timeline: "",
  budget: "",
};

function getHeroControl(product, controlId) {
  return product.controls.find((control) => control.id === controlId);
}

function getHeroOption(product, controlId, value) {
  return getHeroControl(product, controlId)?.options.find((option) => option.value === value);
}

function App() {
  const [language, setLanguage] = useState(() => getInitialLanguage(locales));
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [loaderDone, setLoaderDone] = useState(false);
  const [navSolid, setNavSolid] = useState(false);
  const [activeHeroProduct, setActiveHeroProduct] = useState(DEFAULT_HERO_PRODUCT);
  const [heroSelections, setHeroSelections] = useState(defaultHeroSelections);
  const [contactStep, setContactStep] = useState(0);
  const [contactIntake, setContactIntake] = useState(defaultContactIntake);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const content = locales[language] ?? locales[fallbackLanguage];
  const heroConfiguratorProducts = content.heroConfiguratorProducts;
  const wizardSteps = content.contactSection.wizard.steps;
  const currentWizardLayout = contactWizardLayout[contactStep];
  const currentWizardStep = wizardSteps[contactStep];
  const activeHeroDemo =
    heroConfiguratorProducts.find((product) => product.key === activeHeroProduct) ??
    heroConfiguratorProducts[0];
  const activeHeroValues = heroSelections[activeHeroProduct] ?? defaultHeroSelections[activeHeroProduct];
  const configuratorViewerText = content.configuratorDemo.shell.viewer;
  const wizardProgress = ((contactStep + 1) / wizardSteps.length) * 100;
  const navLinks = [
    { href: "#hero", label: content.nav.hero },
    { href: "#services-portfolio", label: content.nav.capabilities },
    { href: "#pricing", label: content.nav.pricing },
    { href: "#about", label: content.nav.about },
    { href: "#contact", label: content.nav.contact },
  ];

  const updateHeroSelection = (controlId, value) => {
    setHeroSelections((current) => ({
      ...current,
      [activeHeroProduct]: {
        ...(current[activeHeroProduct] ?? defaultHeroSelections[activeHeroProduct]),
        [controlId]: value,
      },
    }));
  };

  const updateContactField = (field, value) => {
    setContactSubmitted(false);
    setContactIntake((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const toggleContactValue = (field, value) => {
    setContactSubmitted(false);
    setContactIntake((current) => {
      const currentValues = current[field];
      if (Array.isArray(currentValues)) {
        return {
          ...current,
          [field]: currentValues.includes(value)
            ? currentValues.filter((item) => item !== value)
            : [...currentValues, value],
        };
      }

      return {
        ...current,
        [field]: currentValues === value ? "" : value,
      };
    });
  };

  const getContactSummaryValue = (key) => {
    const group = content.contactSection.groups[key];
    const currentValue = contactIntake[key];

    if (!group || currentValue === "" || (Array.isArray(currentValue) && currentValue.length === 0)) {
      return "";
    }

    if (Array.isArray(currentValue)) {
      return group.options
        .filter((option) => currentValue.includes(option.value))
        .map((option) => option.label)
        .join(", ");
    }

    return group.options.find((option) => option.value === currentValue)?.label ?? "";
  };

  const contactSummaryItems = contactSummaryKeys
    .map((key) => ({
      key,
      label: content.contactSection.summary.labels[key],
      value: getContactSummaryValue(key),
    }))
    .filter((item) => item.value);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.title = content.meta.title;
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute("content", content.meta.description);
    }
  }, [content.meta.description, content.meta.title, language]);

  useEffect(() => {
    let frame = 0;
    const timer = window.setInterval(() => {
      frame += 1;
      setLoaderProgress((current) => {
        const next = Math.min(100, current + 6 + (frame % 4));
        if (next >= 100) {
          window.clearInterval(timer);
          window.setTimeout(() => setLoaderDone(true), 250);
        }
        return next;
      });
    }, 60);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16 },
    );
    const elements = document.querySelectorAll(".reveal");
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className={`loader ${loaderDone ? "is-done" : ""}`}>
        <div className="loader-content">
          <div className="loader-ring">
            <svg viewBox="0 0 100 100" className="loader-ring-svg">
              <circle className="loader-ring-track" cx="50" cy="50" r="42" />
              <circle
                className="loader-ring-fill"
                cx="50"
                cy="50"
                r="42"
                style={{ strokeDashoffset: `${264 - (loaderProgress / 100) * 264}` }}
              />
            </svg>
            <div className="loader-icon">
              <img src={iconUrl} alt="" aria-hidden="true" />
            </div>
          </div>
          <div className="loader-text">
            <span className="loader-brand">{content.common.brandName}</span>
            <span className="loader-percent">{Math.round(loaderProgress)}%</span>
          </div>
          <div className="loader-bar">
            <span style={{ width: `${loaderProgress}%` }} />
          </div>
        </div>
      </div>
      <SceneCanvas />
      <div className="page-shell">
        <header className={`site-nav ${navSolid ? "is-solid" : ""}`}>
          <div className="nav-inner">
            <a className="brand-lockup" href="#hero" aria-label={content.common.homeAriaLabel}>
              <img src={logoUrl} alt={content.common.brandName} />
            </a>
            <nav className="nav-links" aria-label={content.common.primaryNavAriaLabel}>
              {navLinks.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="nav-actions">
              <div className="language-switcher" role="group" aria-label={content.common.languageSwitcherLabel}>
                {localeOptions.map((option) => (
                  <button
                    key={option.code}
                    className={`language-button ${language === option.code ? "is-active" : ""}`}
                    type="button"
                    aria-pressed={language === option.code}
                    title={option.label}
                    onClick={() => setLanguage(option.code)}
                  >
                    {option.code.toUpperCase()}
                  </button>
                ))}
              </div>
              <a className="nav-cta" href="#contact">
                {content.nav.cta}
              </a>
            </div>
          </div>
        </header>

        <main>
          <section id="hero" className="hero-section section-block" data-scene-marker="hero">
            <div className="container hero-grid">
              <div className="hero-copy reveal">
                <div className="eyebrow">{content.hero.eyebrow}</div>
                <div className="hero-proofline">
                  {content.hero.proofline.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <h1>
                  {content.hero.title}
                  <span> {content.hero.titleAccent}</span>
                </h1>
                <p className="hero-text">{content.hero.copy}</p>
                <div className="hero-actions">
                  <a className="primary-button" href="#contact">
                    {content.hero.primaryCta}
                  </a>
                  <a className="secondary-button" href="#configurator-demo">
                    {content.hero.secondaryCta}
                  </a>
                </div>
                <div className="hero-mini-stats">
                  {content.hero.stats.map((item) => (
                    <div key={item.label}>
                      <strong>{item.label}</strong>
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hero-visual-panel reveal" style={{ transitionDelay: "0.12s" }}>
                <div className="glass-card hero-stage-card">
                  <div className="hero-stage-copy">
                    <span className="metric-label">{content.hero.stage.label}</span>
                    <strong>{content.hero.stage.title}</strong>
                    <p>{content.hero.stage.copy}</p>
                  </div>
                  <div className="hero-stage-visual" aria-hidden="true">
                    <div className="hero-stage-gridline gridline-x" />
                    <div className="hero-stage-gridline gridline-y" />
                    <div className="hero-stage-orbit orbit-a" />
                    <div className="hero-stage-orbit orbit-b" />
                    <div className="hero-stage-panel panel-back" />
                    <div className="hero-stage-panel panel-main" />
                    <div className="hero-stage-panel panel-front" />
                    <div className="hero-stage-cardlet cardlet-a" />
                    <div className="hero-stage-cardlet cardlet-b" />
                    <div className="hero-stage-cardlet cardlet-c" />
                    <div className="hero-stage-node node-a" />
                    <div className="hero-stage-node node-b" />
                    <div className="hero-stage-node node-c" />
                  </div>
                  <div className="hero-stage-points">
                    {content.hero.stage.points.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
                <div className="glass-card hero-delivery-card">
                  <span className="chip">{content.hero.delivery.chip}</span>
                  <p>{content.hero.delivery.copy}</p>
                  <div className="hero-shell-footer hero-delivery-meta">
                    {content.hero.delivery.points.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="configurator-demo" className="section-block configurator-demo-section">
            <div className="container">
              <div className="section-head reveal">
                <div className="eyebrow">{content.configuratorDemo.eyebrow}</div>
                <h2>{content.configuratorDemo.title}</h2>
                <p>{content.configuratorDemo.copy}</p>
              </div>

              <div className="configurator-demo-grid">
                <div className="configurator-demo-sidebar reveal">
                  <div className="glass-card configurator-demo-copy">
                    <span className="metric-label">{content.configuratorDemo.sidebar.label}</span>
                    <h3>{content.configuratorDemo.sidebar.title}</h3>
                    <p>{content.configuratorDemo.sidebar.copy}</p>
                    <div className="hero-shell-footer">
                      {content.configuratorDemo.sidebar.points.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card hero-delivery-card">
                    <span className="chip">{activeHeroDemo.category}</span>
                    <p>{content.configuratorDemo.delivery.copy}</p>
                    <div className="hero-shell-footer hero-delivery-meta">
                      <span>{getHeroOption(activeHeroDemo, "size", activeHeroValues.size)?.label}</span>
                      <span>{getHeroOption(activeHeroDemo, "finish", activeHeroValues.finish)?.label}</span>
                      <span>{getHeroOption(activeHeroDemo, "feature", activeHeroValues.feature)?.label}</span>
                      <span>{getHeroOption(activeHeroDemo, "environment", activeHeroValues.environment)?.label}</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card hero-configurator-shell reveal" style={{ transitionDelay: "0.12s" }}>
                  <div className="hero-shell-header">
                    <div>
                      <span className="metric-label">{content.configuratorDemo.shell.label}</span>
                      <strong>{content.configuratorDemo.shell.title}</strong>
                      <p>{content.configuratorDemo.shell.copy}</p>
                    </div>
                    <span className="hero-shell-chip">Three.js</span>
                  </div>

                  <div className="hero-product-tabs" aria-label={content.common.productExamplesAriaLabel}>
                    {heroConfiguratorProducts.map((product) => (
                      <button
                        key={product.key}
                        className={`hero-product-tab ${product.key === activeHeroProduct ? "is-active" : ""}`}
                        type="button"
                        aria-pressed={product.key === activeHeroProduct}
                        onClick={() => setActiveHeroProduct(product.key)}
                      >
                        <strong>{product.label}</strong>
                        <small>{product.category}</small>
                      </button>
                    ))}
                  </div>

                  <div className="hero-shell-body">
                    <div className="configurator-stage">
                      <div className="stage-badge">{content.configuratorDemo.shell.stageBadge}</div>
                      <ConfiguratorExperience
                        product={activeHeroDemo}
                        selections={activeHeroValues}
                        viewerText={configuratorViewerText}
                      />
                    </div>

                    <div className="configurator-controls">
                      {activeHeroDemo.controls.map((control) => (
                        <div className="control-group" key={control.id}>
                          <span className="control-label">{control.label}</span>
                          <div className={control.type === "swatch" ? "swatch-row" : "control-options"}>
                            {control.options.map((option) => {
                              const isActive = activeHeroValues[control.id] === option.value;

                              if (control.type === "swatch") {
                                return (
                                  <button
                                    key={option.value}
                                    className={`swatch ${isActive ? "is-active" : ""}`}
                                    type="button"
                                    aria-label={option.label}
                                    aria-pressed={isActive}
                                    title={option.label}
                                    style={{ background: option.color }}
                                    onClick={() => updateHeroSelection(control.id, option.value)}
                                  />
                                );
                              }

                              return (
                                <button
                                  key={option.value}
                                  className={`control-pill ${isActive ? "is-active" : ""}`}
                                  type="button"
                                  aria-pressed={isActive}
                                  onClick={() => updateHeroSelection(control.id, option.value)}
                                >
                                  {option.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="hero-shell-footer">
                    {content.configuratorDemo.shell.footerPoints.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section id="services-portfolio" className="section-block services-section">
            <div className="scene-sentinel" data-scene-marker="services" />
            <div className="container">
              <div className="section-head reveal">
                <div className="eyebrow">{content.servicesSection.eyebrow}</div>
                <h2>{content.servicesSection.title}</h2>
                <p>{content.servicesSection.copy}</p>
              </div>

              <div className="configurator-showcase reveal">
                <div className="configurator-showcase-copy">
                  <div className="eyebrow">{content.servicesSection.showcaseEyebrow}</div>
                  <h3>{content.servicesSection.showcaseTitle}</h3>
                  <p>{content.servicesSection.showcaseCopy}</p>
                </div>

                <div className="configurator-feature-grid">
                  {content.servicesSection.configuratorFeatures.map((item, index) => (
                    <article
                      className="glass-card configurator-feature-card"
                      key={item.title}
                      style={{ transitionDelay: `${index * 0.06}s` }}
                    >
                      <h4>{item.title}</h4>
                      <p>{item.copy}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="service-grid">
                {content.servicesSection.services.map((service, index) => (
                  <article
                    className="glass-card service-card reveal"
                    key={service.title}
                    style={{ transitionDelay: `${index * 0.08}s` }}
                  >
                    <span className="service-index">0{index + 1}</span>
                    <h3>{service.title}</h3>
                    <p>{service.copy}</p>
                    <div className="tag-row">
                      {service.tags.map((tag) => (
                        <span className="tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              <div className="scene-sentinel portfolio-sentinel" data-scene-marker="portfolio" />

              <div className="portfolio-panel reveal">
                <div className="section-head compact">
                  <div className="eyebrow">{content.servicesSection.portfolioEyebrow}</div>
                  <h2>{content.servicesSection.portfolioTitle}</h2>
                </div>

                <div className="portfolio-grid">
                  {content.servicesSection.portfolio.map((project) => (
                    <article className="portfolio-card" key={project.name}>
                      <span className="portfolio-type">{project.type}</span>
                      <h3>{project.name}</h3>
                      <p>{project.result}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section className="section-block build-section">
            <div className="container">
              <div className="section-head reveal">
                <div className="eyebrow">{content.buildSection.eyebrow}</div>
                <h2>{content.buildSection.title}</h2>
                <p>{content.buildSection.copy}</p>
              </div>

              <div className="build-grid">
                {content.buildSection.items.map((item, index) => (
                  <article
                    className="glass-card build-card reveal"
                    key={item.title}
                    style={{ transitionDelay: `${index * 0.06}s` }}
                  >
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section-block sales-section">
            <div className="container">
              <div className="section-head reveal">
                <div className="eyebrow">{content.salesSection.eyebrow}</div>
                <h2>{content.salesSection.title}</h2>
                <p>{content.salesSection.copy}</p>
              </div>

              <div className="sales-grid">
                {content.salesSection.drivers.map((item, index) => (
                  <article
                    className="glass-card sales-card reveal"
                    key={item.title}
                    style={{ transitionDelay: `${index * 0.06}s` }}
                  >
                    <span className="sales-kicker">{content.salesSection.kicker}</span>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section-block process-section">
            <div className="container">
              <div className="section-head centered reveal">
                <div className="eyebrow">{content.processSection.eyebrow}</div>
                <h2>{content.processSection.title}</h2>
                <p>{content.processSection.copy}</p>
              </div>

              <div className="process-grid">
                {content.processSection.steps.map((item, index) => (
                  <article
                    className="glass-card process-card reveal"
                    key={item.step}
                    style={{ transitionDelay: `${index * 0.08}s` }}
                  >
                    <span className="process-step">{item.step}</span>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
          <section id="pricing" className="section-block pricing-section" data-scene-marker="pricing">
            <div className="container">
              <div className="section-head centered reveal">
                <div className="eyebrow">{content.pricingSection.eyebrow}</div>
                <h2>{content.pricingSection.title}</h2>
                <p>{content.pricingSection.copy}</p>
              </div>

              <div className="pricing-grid">
                {content.pricingSection.tiers.map((tier, index) => (
                  <article
                    className={`glass-card pricing-card ${tier.featured ? "featured" : ""} reveal`}
                    key={tier.tier}
                    style={{ transitionDelay: `${index * 0.08}s` }}
                  >
                    {tier.featured ? <span className="pricing-badge">{content.pricingSection.badge}</span> : null}
                    <div className="pricing-tier">{tier.tier}</div>
                    <div className="pricing-price">{tier.price}</div>
                    <p className="pricing-copy">{tier.subtitle}</p>
                    <ul className="feature-list">
                      {tier.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                    <a className={tier.featured ? "primary-button" : "secondary-button"} href="#contact">
                      {content.pricingSection.cta}
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="about" className="section-block about-section" data-scene-marker="about">
            <div className="container about-grid">
              <div className="section-head reveal">
                <div className="eyebrow">{content.aboutSection.eyebrow}</div>
                <h2>{content.aboutSection.title}</h2>
                <p>{content.aboutSection.copy}</p>
              </div>

              <div className="about-panel glass-card reveal" style={{ transitionDelay: "0.12s" }}>
                {content.aboutSection.principles.map((principle) => (
                  <article key={principle.title} className="principle">
                    <h3>{principle.title}</h3>
                    <p>{principle.copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="contact" className="section-block contact-section" data-scene-marker="contact">
            <div className="container">
              <div className="contact-shell">
                <div className="contact-story reveal">
                  <div className="glass-card contact-story-card">
                    <div className="eyebrow">{content.contactSection.eyebrow}</div>
                    <h2>{content.contactSection.title}</h2>
                    <p>{content.contactSection.copy}</p>

                    <div className="contact-fact-grid">
                      {content.contactSection.facts.map((fact) => (
                        <article className="contact-fact-card" key={fact}>
                          <span className="contact-fact-mark" />
                          <strong>{fact}</strong>
                        </article>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card contact-steps-card">
                    <span className="chip contact-intake-chip">{content.contactSection.wizard.introLabel}</span>
                    <div className="contact-step-rail">
                      {wizardSteps.map((step, index) => (
                        <button
                          key={step.title}
                          className={`contact-rail-step ${index === contactStep ? "is-active" : ""}`}
                          type="button"
                          aria-pressed={index === contactStep}
                          onClick={() => {
                            setContactSubmitted(false);
                            setContactStep(index);
                          }}
                        >
                          <small>{String(index + 1).padStart(2, "0")}</small>
                          <div>
                            <strong>{step.title}</strong>
                            <p>{step.copy}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <form className="glass-card contact-form contact-intake contact-intake-shell reveal" style={{ transitionDelay: "0.12s" }}>
                  <div className="contact-intake-sidebar">
                    <div className="contact-intake-topline">
                      <span className="contact-step-count">
                        {content.contactSection.wizard.stepLabel} {contactStep + 1} / {wizardSteps.length}
                      </span>
                    </div>

                    <div className="contact-progress" aria-hidden="true">
                      <span style={{ width: `${wizardProgress}%` }} />
                    </div>

                    <div className="contact-sidebar-card contact-sidebar-current">
                      <small>{String(contactStep + 1).padStart(2, "0")}</small>
                      <strong>{currentWizardStep.title}</strong>
                      <p>{currentWizardStep.copy}</p>
                    </div>

                    <div className="contact-sidebar-card contact-sidebar-brief">
                      <small>{String(contactSummaryItems.length).padStart(2, "0")}</small>
                      <strong>{content.contactSection.summary.title}</strong>
                      <p>
                        {contactIntake.productName || contactIntake.company || content.contactSection.summary.empty}
                      </p>
                    </div>
                  </div>

                  <div className="contact-intake-main">
                    <div className="contact-intake-workspace">
                      <div className="contact-step-panel">
                        <div className="contact-step-intro">
                          <h3>{currentWizardStep.title}</h3>
                          <p>{currentWizardStep.copy}</p>
                        </div>

                        {currentWizardLayout.fieldKeys.length ? (
                          <div className="contact-detail-grid">
                            {currentWizardLayout.fieldKeys.map((fieldKey) => (
                              <label
                                key={fieldKey}
                                className={fieldKey === "brief" ? "contact-input-block contact-input-block-wide" : "contact-input-block"}
                              >
                                {content.contactSection.fields[fieldKey].label}
                                {fieldKey === "brief" ? (
                                  <textarea
                                    rows="5"
                                    value={contactIntake[fieldKey]}
                                    placeholder={content.contactSection.fields[fieldKey].placeholder}
                                    onChange={(event) => updateContactField(fieldKey, event.target.value)}
                                  />
                                ) : (
                                  <input
                                    type={fieldKey === "email" ? "email" : "text"}
                                    value={contactIntake[fieldKey]}
                                    placeholder={content.contactSection.fields[fieldKey].placeholder}
                                    onChange={(event) => updateContactField(fieldKey, event.target.value)}
                                  />
                                )}
                              </label>
                            ))}
                          </div>
                        ) : null}

                        {currentWizardLayout.groupKeys.map((groupKey) => {
                          const group = content.contactSection.groups[groupKey];
                          const currentValue = contactIntake[groupKey];

                          return (
                            <div className="contact-choice-group" key={groupKey}>
                              <div className="contact-choice-head">
                                <span className="contact-choice-label">{group.label}</span>
                                <p>{group.description}</p>
                              </div>

                              <div className={`contact-option-grid ${group.multi ? "" : "is-compact"}`}>
                                {group.options.map((option) => {
                                  const isActive = Array.isArray(currentValue)
                                    ? currentValue.includes(option.value)
                                    : currentValue === option.value;

                                  return (
                                    <button
                                      key={option.value}
                                      className={`contact-option-card ${isActive ? "is-active" : ""}`}
                                      type="button"
                                      aria-pressed={isActive}
                                      onClick={() => toggleContactValue(groupKey, option.value)}
                                    >
                                      <strong>{option.label}</strong>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="contact-summary contact-summary-panel">
                        <div className="contact-summary-head">
                          <strong>{content.contactSection.summary.title}</strong>
                          <p>
                            {contactIntake.productName || contactIntake.company || content.contactSection.summary.empty}
                          </p>
                        </div>

                        {contactSummaryItems.length ? (
                          <div className="contact-summary-list">
                            {contactSummaryItems.map((item) => (
                              <div className="contact-summary-row" key={item.key}>
                                <span>{item.label}</span>
                                <strong>{item.value}</strong>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="contact-summary-empty">{content.contactSection.summary.empty}</p>
                        )}
                      </div>
                    </div>

                    {contactSubmitted ? (
                      <div className="contact-success-banner">
                        <strong>{content.contactSection.wizard.successTitle}</strong>
                        <p>{content.contactSection.wizard.successCopy}</p>
                      </div>
                    ) : null}

                    <div className="contact-form-actions">
                      <button
                        className="secondary-button"
                        type="button"
                        disabled={contactStep === 0}
                        onClick={() => {
                          setContactSubmitted(false);
                          setContactStep((current) => Math.max(0, current - 1));
                        }}
                      >
                        {content.contactSection.wizard.previous}
                      </button>
                      <button
                        className="primary-button submit-button"
                        type="button"
                        onClick={() => {
                          if (contactStep === wizardSteps.length - 1) {
                            setContactSubmitted(true);
                            return;
                          }
                          setContactSubmitted(false);
                          setContactStep((current) => Math.min(wizardSteps.length - 1, current + 1));
                        }}
                      >
                        {contactStep === wizardSteps.length - 1
                          ? content.contactSection.wizard.submit
                          : content.contactSection.wizard.next}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <div className="container footer-shell">
            <div className="footer-top">
              <div className="footer-brand">
                <a className="brand-lockup footer-logo" href="#hero" aria-label={content.common.homeAriaLabel}>
                  <img src={logoUrl} alt={content.common.brandName} />
                </a>
                <p>{content.footer.copy}</p>
                <a className="primary-button footer-cta" href="#contact">
                  {content.footer.cta}
                </a>
              </div>

              <div className="footer-column">
                <h3>{content.footer.capabilitiesTitle}</h3>
                <ul>
                  {content.footer.capabilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="footer-column">
                <h3>{content.footer.outcomesTitle}</h3>
                <ul>
                  {content.footer.outcomes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="footer-column">
                <h3>{content.footer.contactTitle}</h3>
                <ul>
                  {content.footer.contactItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                  <li>
                    <a href="#pricing">{content.footer.pricingLink}</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="footer-bottom">
              <span>{content.footer.copyright}</span>
              <div className="footer-links">
                <a href="#services-portfolio">{content.nav.capabilities}</a>
                <a href="#pricing">{content.nav.pricing}</a>
                <a href="#about">{content.nav.about}</a>
                <a href="#contact">{content.nav.contact}</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
