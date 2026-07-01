import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Lightbox from "../components/Lightbox";
import { projects, projectCategories } from "../data/projects";

function interleaveWorkItems(items) {
  const design = items.filter((project) => project.kind !== "digital");
  const digital = items.filter((project) => project.kind === "digital");
  const mixed = [];
  const rounds = Math.max(design.length, digital.length);

  for (let i = 0; i < rounds; i += 1) {
    if (design[i]) mixed.push(design[i]);
    if (digital[i]) mixed.push(digital[i]);
  }

  return mixed;
}

function Work({ content }) {
  const { workPage, nav } = content;
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightbox, setLightbox] = useState({ images: [], index: null });

  const visibleProjects = useMemo(
    () => {
      if (activeCategory === "all") {
        return interleaveWorkItems(projects);
      }

      return projects.filter((project) => project.category === activeCategory);
    },
    [activeCategory],
  );

  const openLightbox = (images, index) => setLightbox({ images, index });
  const closeLightbox = () => setLightbox((prev) => ({ ...prev, index: null }));

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
          <div className="work-filter reveal" role="tablist" aria-label="Filter work by category">
            {projectCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === category.id}
                className={`work-filter-pill${activeCategory === category.id ? " is-active" : ""}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="work-projects">
            {visibleProjects.map((project, i) => (
              <article
                className={`work-project reveal${project.kind === "digital" ? " is-digital" : ""}`}
                key={project.slug}
                style={{ transitionDelay: `${(i % 3) * 0.08}s` }}
              >
                {project.kind === "digital" ? (
                  <div
                    className="work-digital-card"
                    style={
                      project.coverImage
                        ? { "--work-card-image": `url(${project.coverImage})` }
                        : undefined
                    }
                    aria-hidden="true"
                  >
                    <span>{project.category === "automation" ? "Automation" : "Software"}</span>
                    <strong>{project.name}</strong>
                    <p>{project.platform}</p>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="work-project-cover"
                    onClick={() => openLightbox(project.images, 0)}
                    aria-label={`Open ${project.name} gallery`}
                  >
                    <img src={project.images[0].src} alt={project.images[0].alt} loading="lazy" />
                    <span className="work-project-zoom" aria-hidden="true">View gallery</span>
                  </button>
                )}

                <div className="work-project-meta">
                  <div className="work-project-head">
                    <span className="portfolio-type">{project.type}</span>
                    <span className="work-project-year">{project.year}</span>
                  </div>
                  <h2>{project.name}</h2>
                  <p className="work-project-summary">{project.summary}</p>
                  <div className="work-project-scope">
                    {project.scope.map((tag) => (
                      <span className="tag" key={tag}>{tag}</span>
                    ))}
                  </div>
                  {project.stack?.length ? (
                    <div className="work-project-stack" aria-label="Project technology stack">
                      {project.stack.map((item) => (
                        <span className="stack-tag" key={item}>{item}</span>
                      ))}
                    </div>
                  ) : null}
                  {project.kind === "digital" ? (
                    <div className="work-project-details">
                      <p><strong>Platform:</strong> {project.platform}</p>
                      <p><strong>Result:</strong> {project.outcome}</p>
                    </div>
                  ) : null}
                  {project.images?.length > 1 ? (
                    <div className="work-project-thumbs">
                      {project.images.slice(1).map((image, idx) => (
                        <button
                          type="button"
                          className="work-project-thumb"
                          key={image.src}
                          onClick={() => openLightbox(project.images, idx + 1)}
                          aria-label={`Open image: ${image.alt}`}
                        >
                          <img src={image.src} alt={image.alt} loading="lazy" />
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block cta-section">
        <div className="container cta-container reveal">
          <h2>Have a project like this in mind?</h2>
          <p>Every project starts with a conversation.</p>
          <Link className="primary-button" to="/contact">{nav.cta}</Link>
        </div>
      </section>

      <Lightbox
        images={lightbox.images}
        index={lightbox.index}
        onClose={closeLightbox}
        onIndexChange={(index) => setLightbox((prev) => ({ ...prev, index }))}
      />
    </main>
  );
}

export default Work;
