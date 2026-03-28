import { Link } from "react-router-dom";
import { useState } from "react";

function Pricing({ content }) {
  const { pricingPage, nav } = content;
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <main className="page-pricing">
      <section className="page-header section-block">
        <div className="container centered">
          <div className="eyebrow reveal">{pricingPage.eyebrow}</div>
          <h1 className="page-title reveal">{pricingPage.headline}</h1>
          <p className="page-subtitle reveal">{pricingPage.copy}</p>
        </div>
      </section>

      <section className="section-block pricing-block">
        <div className="container">
          <div className="pricing-grid">
            {pricingPage.tiers.map((tier, i) => (
              <article
                className={`glass-card pricing-card ${tier.featured ? "featured" : ""} reveal`}
                key={tier.tier}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                {tier.featured ? (
                  <span className="pricing-badge">{pricingPage.badge}</span>
                ) : null}
                <div className="pricing-tier">{tier.tier}</div>
                <div className="pricing-price">{tier.price}</div>
                <p className="pricing-copy">{tier.subtitle}</p>
                <ul className="feature-list">
                  {tier.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <Link
                  className={tier.featured ? "primary-button" : "secondary-button"}
                  to="/contact"
                >
                  {pricingPage.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-block faq-section">
        <div className="container container-narrow">
          <div className="section-head centered reveal">
            <h2>Common questions</h2>
          </div>
          <div className="faq-list">
            {pricingPage.faq.map((item, i) => (
              <div
                className={`faq-item reveal ${openFaq === i ? "is-open" : ""}`}
                key={item.q}
                style={{ transitionDelay: `${i * 0.06}s` }}
              >
                <button
                  className="faq-question"
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{item.q}</span>
                  <span className="faq-icon">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i ? <p className="faq-answer">{item.a}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block cta-section">
        <div className="container cta-container reveal">
          <h2>Ready to get started?</h2>
          <p>Tell us about your project and we'll scope it together.</p>
          <Link className="primary-button" to="/contact">{nav.cta}</Link>
        </div>
      </section>
    </main>
  );
}

export default Pricing;
