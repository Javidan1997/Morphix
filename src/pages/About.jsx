import { Link } from "react-router-dom";
import MediaSlotsSection from "../components/MediaSlotsSection";

function About({ content }) {
  const { aboutPage, nav, aboutMediaGallery } = content;

  return (
    <main className="page-about">
      <section className="page-header section-block">
        <div className="container">
          <div className="eyebrow reveal">{aboutPage.eyebrow}</div>
          <h1 className="page-title reveal">{aboutPage.headline}</h1>
          <p className="page-subtitle reveal">{aboutPage.copy}</p>
        </div>
      </section>

      <section className="section-block">
        <div className="container">
          <div className="principles-grid">
            {aboutPage.principles.map((principle, i) => (
              <article className="glass-card principle-card reveal" key={principle.title} style={{ transitionDelay: `${i * 0.08}s` }}>
                <h3>{principle.title}</h3>
                <p>{principle.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <MediaSlotsSection copy={aboutMediaGallery} />

      <section className="section-block story-section">
        <div className="container container-narrow">
          <div className="story-block reveal">
            <h2>{aboutPage.story.title}</h2>
            <p>{aboutPage.story.copy}</p>
          </div>
        </div>
      </section>

      <section className="section-block cta-section">
        <div className="container cta-container reveal">
          <h2>Let's work together.</h2>
          <p>We're always looking for interesting products to help launch.</p>
          <Link className="primary-button" to="/contact">{nav.cta}</Link>
        </div>
      </section>
    </main>
  );
}

export default About;
