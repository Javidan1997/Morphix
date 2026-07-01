import { useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { getInsight } from "../data/insights";

const ORIGIN = "https://configuro.studio";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

function Block({ block }) {
  if (block.type === "h2") return <h2>{block.text}</h2>;
  if (block.type === "ul") {
    return (
      <ul>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  return <p>{block.text}</p>;
}

function InsightArticle({ content }) {
  const { nav } = content;
  const { slug } = useParams();
  const article = getInsight(slug);
  const url = article ? `${ORIGIN}/insights/${article.slug}` : "";

  // This route is dynamic, so it owns its own SEO tags + Article structured data.
  useEffect(() => {
    if (!article) return undefined;
    const prevTitle = document.title;
    document.title = `${article.title} | Configuro`;

    const setMeta = (selector, attr, value) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    };
    setMeta('meta[name="description"]', "content", article.description);
    setMeta('meta[property="og:title"]', "content", `${article.title} | Configuro`);
    setMeta('meta[property="og:description"]', "content", article.description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:image"]', "content", `${ORIGIN}${article.cover}`);
    setMeta('link[rel="canonical"]', "href", url);

    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.id = "article-jsonld";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: article.title,
      description: article.description,
      datePublished: article.date,
      dateModified: article.date,
      image: `${ORIGIN}${article.cover}`,
      author: { "@type": "Organization", name: "Configuro", url: `${ORIGIN}/` },
      publisher: {
        "@type": "Organization",
        name: "Configuro",
        logo: { "@type": "ImageObject", url: `${ORIGIN}/morphix-logo.svg` },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      url,
    });
    document.head.appendChild(ld);

    return () => {
      document.title = prevTitle;
      const existing = document.getElementById("article-jsonld");
      if (existing) existing.remove();
    };
  }, [article, url]);

  if (!article) return <Navigate replace to="/insights" />;

  return (
    <main className="page-insight-article">
      <article className="section-block">
        <div className="container container-narrow">
          <div className="insight-article-head reveal">
            <Link className="insight-back-link" to="/insights">← All insights</Link>
            <div className="insight-article-meta">
              <span>{formatDate(article.date)}</span>
              <span>·</span>
              <span>{article.readingMinutes} min read</span>
            </div>
            <h1 className="page-title">{article.title}</h1>
            <p className="page-subtitle">{article.description}</p>
          </div>

          <figure className="insight-article-cover reveal">
            <img src={article.cover} alt={article.coverAlt} />
          </figure>

          <div className="insight-article-body reveal">
            {article.body.map((block, i) => (
              <Block block={block} key={i} />
            ))}
          </div>
        </div>
      </article>

      <section className="section-block cta-section">
        <div className="container cta-container reveal">
          <h2>Want this for your product?</h2>
          <p>We build the software, set up the automation, and make it look good. Tell us what you're working on.</p>
          <Link className="primary-button" to="/contact">{nav.cta}</Link>
        </div>
      </section>
    </main>
  );
}

export default InsightArticle;
