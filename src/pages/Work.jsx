import { Link } from "react-router-dom";
import MediaSlotsSection from "../components/MediaSlotsSection";

function Work({ content }) {
  const { workPage, nav, workMediaGallery } = content;

  return (
    <main className="page-work">
      <section className="page-header section-block">
        <div className="container">
          <div className="eyebrow reveal">{workPage.eyebrow}</div>
          <h1 className="page-title reveal">{workPage.headline}</h1>
          <p className="page-subtitle reveal">{workPage.copy}</p>
        </div>
      </section>

      <section className="section-block">
        <div className="container">
          <div className="work-grid">
            {workPage.projects.map((project, i) => (
              <article className="work-card reveal" key={project.name} style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="work-card-header">
                  <span className="portfolio-type">{project.type}</span>
                  <h3>{project.name}</h3>
                </div>
                <div className="work-card-body">
                  <p className="work-result">{project.result}</p>
                  <p className="work-details">{project.details}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <MediaSlotsSection copy={workMediaGallery} />

      <section className="section-block cta-section">
        <div className="container cta-container reveal">
          <h2>Want to see your product here?</h2>
          <p>Every project starts with a conversation.</p>
          <Link className="primary-button" to="/contact">{nav.cta}</Link>
        </div>
      </section>
    </main>
  );
}

export default Work;
