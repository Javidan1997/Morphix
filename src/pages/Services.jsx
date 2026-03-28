import { useState } from "react";
import { Link } from "react-router-dom";
import ConfiguratorExperience from "../components/ConfiguratorExperience";

const DEFAULT_HERO_PRODUCT = "sofa";
const defaultHeroSelections = {
  sofa: { size: "standard", finish: "graphite", feature: "lounge", environment: "loft" },
  phone: { size: "standard", finish: "graphite", feature: "camera", environment: "studio" },
  headset: { size: "standard", finish: "carbon", feature: "gaming", environment: "stage" },
};

function getHeroOption(product, controlId, value) {
  return product.controls.find((c) => c.id === controlId)?.options.find((o) => o.value === value);
}

function Services({ content }) {
  const { servicesPage, configuratorDemo, heroConfiguratorProducts, nav } = content;
  const [activeHeroProduct, setActiveHeroProduct] = useState(DEFAULT_HERO_PRODUCT);
  const [heroSelections, setHeroSelections] = useState(defaultHeroSelections);

  const activeHeroDemo =
    heroConfiguratorProducts.find((p) => p.key === activeHeroProduct) ??
    heroConfiguratorProducts[0];
  const activeHeroValues = heroSelections[activeHeroProduct] ?? defaultHeroSelections[activeHeroProduct];
  const configuratorViewerText = configuratorDemo.shell.viewer;

  const updateHeroSelection = (controlId, value) => {
    setHeroSelections((current) => ({
      ...current,
      [activeHeroProduct]: {
        ...(current[activeHeroProduct] ?? defaultHeroSelections[activeHeroProduct]),
        [controlId]: value,
      },
    }));
  };

  return (
    <main className="page-services">
      {/* Header */}
      <section className="page-header section-block">
        <div className="container">
          <div className="eyebrow reveal">{servicesPage.eyebrow}</div>
          <h1 className="page-title reveal">{servicesPage.headline}</h1>
          <p className="page-subtitle reveal">{servicesPage.copy}</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-block">
        <div className="container">
          <div className="service-grid">
            {servicesPage.services.map((service, i) => (
              <article className="glass-card service-card reveal" key={service.title} style={{ transitionDelay: `${i * 0.06}s` }}>
                <span className="service-index">0{i + 1}</span>
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
                <div className="tag-row">
                  {service.tags.map((tag) => (
                    <span className="tag" key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Configurator Feature */}
      <section className="section-block configurator-feature-section">
        <div className="container">
          <div className="section-head reveal">
            <div className="eyebrow">{servicesPage.configurator.eyebrow}</div>
            <h2>{servicesPage.configurator.title}</h2>
            <p>{servicesPage.configurator.copy}</p>
          </div>
          <div className="configurator-feature-grid">
            {servicesPage.configurator.features.map((item, i) => (
              <article className="glass-card configurator-feature-card reveal" key={item.title} style={{ transitionDelay: `${i * 0.06}s` }}>
                <h4>{item.title}</h4>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo */}
      <section className="section-block configurator-demo-section">
        <div className="container">
          <div className="section-head reveal">
            <div className="eyebrow">{configuratorDemo.eyebrow}</div>
            <h2>{configuratorDemo.title}</h2>
            <p>{configuratorDemo.copy}</p>
          </div>

          <div className="glass-card hero-configurator-shell reveal">
            <div className="hero-shell-header">
              <div>
                <span className="metric-label">{configuratorDemo.shell.label}</span>
                <strong>{configuratorDemo.shell.title}</strong>
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
                <div className="stage-badge">{configuratorDemo.shell.stageBadge}</div>
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
              {configuratorDemo.shell.footerPoints.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-block process-section">
        <div className="container">
          <div className="section-head centered reveal">
            <div className="eyebrow">{servicesPage.process.eyebrow}</div>
            <h2>{servicesPage.process.title}</h2>
            <p>{servicesPage.process.copy}</p>
          </div>
          <div className="process-grid">
            {servicesPage.process.steps.map((step, i) => (
              <article className="glass-card process-card reveal" key={step.step} style={{ transitionDelay: `${i * 0.08}s` }}>
                <span className="process-step">{step.step}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-block cta-section">
        <div className="container cta-container reveal">
          <h2>Have a product that needs a better story?</h2>
          <p>Let's talk about what we can build together.</p>
          <Link className="primary-button" to="/contact">{nav.cta}</Link>
        </div>
      </section>
    </main>
  );
}

export default Services;
