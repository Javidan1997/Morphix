import { Link } from "react-router-dom";
import { platformOrder, platformPages } from "../data/platformPages";

const paths = platformOrder.filter((slug) => slug !== "shopify");

function FreelanceHub() {
  return (
    <main className="platform-page platform-hub platform-theme-cobalt">
      <section className="platform-hub-hero">
        <div className="container">
          <h1 className="reveal">A clearer way to hire Configuro from your freelance platform.</h1>
          <p className="reveal">Choose where the conversation started. Each page explains the delivery model, scope format and review rhythm that fit that marketplace.</p>
          <a className="platform-primary reveal" href="#platforms">Choose your platform</a>
        </div>
      </section>
      <section className="platform-hub-directory" id="platforms">
        <div className="container">
          {paths.map((slug, index) => {
            const page = platformPages[slug];
            return (
              <Link className={`platform-hub-link platform-theme-${page.theme} reveal`} to={`/${slug}`} key={slug}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h2>{page.platform}</h2><p>{page.headline}</p></div>
                <strong aria-hidden="true">↗</strong>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="platform-hub-shopify">
        <div className="container">
          <div><h2>Looking for a Shopify specialist?</h2><p>Store strategy, theme engineering, custom apps, migration and performance in one dedicated commerce build.</p></div>
          <Link className="platform-primary" to="/shopify">Explore Shopify services</Link>
        </div>
      </section>
    </main>
  );
}

export default FreelanceHub;
