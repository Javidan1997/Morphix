import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { insights, insightCategories } from "../data/insights";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

function Insights({ content }) {
  const { nav } = content;
  const [category, setCategory] = useState("all");

  const visible = useMemo(
    () => (category === "all" ? insights : insights.filter((a) => a.category === category)),
    [category],
  );

  return (
    <main className="page-insights">
      <section className="page-header section-block">
        <div className="container">
          <div className="eyebrow reveal">Insights</div>
          <h1 className="page-title reveal">Field notes from the studio.</h1>
          <p className="page-subtitle reveal">
            Practical writing on 3D configurators, CRM automation, and building web and mobile
            products people actually buy.
          </p>
        </div>
      </section>

      <section className="section-block">
        <div className="container">
          <div className="work-filter reveal" role="tablist" aria-label="Filter insights by topic">
            {insightCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={category === cat.id}
                className={`work-filter-pill${category === cat.id ? " is-active" : ""}`}
                onClick={() => setCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="insights-grid">
            {visible.map((article, i) => (
              <article className="glass-card insight-card reveal" key={article.slug} style={{ transitionDelay: `${(i % 3) * 0.08}s` }}>
                <Link to={`/insights/${article.slug}`} className="insight-card-cover" aria-label={article.title}>
                  <img src={article.cover} alt={article.coverAlt} loading="lazy" />
                </Link>
                <div className="insight-card-body">
                  <div className="insight-card-meta">
                    <span className="tag">{insightCategories.find((c) => c.id === article.category)?.label}</span>
                    <span className="insight-card-date">{formatDate(article.date)} · {article.readingMinutes} min</span>
                  </div>
                  <h2><Link to={`/insights/${article.slug}`}>{article.title}</Link></h2>
                  <p>{article.description}</p>
                  <Link className="insight-card-link" to={`/insights/${article.slug}`}>Read article →</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block cta-section">
        <div className="container cta-container reveal">
          <h2>Have a project in mind?</h2>
          <p>Tell us what you're building. An app, a configurator, or an automated sales system.</p>
          <Link className="primary-button" to="/contact">{nav.cta}</Link>
        </div>
      </section>
    </main>
  );
}

export default Insights;
