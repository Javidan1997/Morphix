import { Link } from "react-router-dom";
import MediaSlotsSection from "../components/MediaSlotsSection";

const FALLBACK_SERVICES_INTRO = {
  eyebrow: "Where we help most",
  title: "Support that matches the way people actually buy.",
  copy:
    "Some teams need a launch site. Others need stronger assets, clearer product explanations, or an interactive layer that helps sales conversations move faster.",
};

const FALLBACK_SERVICES_STORY = {
  panelLabel: "Built for real launches",
  title: "We help when the product is ready, but the digital story is not.",
  copy:
    "Most clients come to us with a strong product, scattered assets, and a deadline. We bring the message, visuals, and frontend together so the final experience feels deliberate from day one.",
  points: [
    {
      title: "One team, one thread",
      copy: "Strategy, copy, 3D, motion, and build move together instead of across disconnected vendors.",
    },
    {
      title: "Designed around buyer questions",
      copy: "We focus on what people need to understand before they trust the product or book the call.",
    },
    {
      title: "Launch-ready, not concept-only",
      copy: "Layouts, assets, and interactions are planned together so nothing feels bolted on at the end.",
    },
  ],
  note:
    "We are especially useful when the product has multiple options, technical detail, or a premium price that needs stronger explanation.",
};

const FALLBACK_MEDIA_SHOWCASE = {
  eyebrow: "Content slots",
  title: "Room for the proof your Services page still needs.",
  copy:
    "We added dedicated image and video areas so this page can carry real launch material, demos, and case-study assets without another redesign.",
  items: [
    {
      type: "video",
      label: "Video slot",
      title: "Hero reveal or walkthrough",
      copy: "Use this space for a short launch film, interface capture, or narrated overview of the product.",
    },
    {
      type: "image",
      label: "Image slot",
      title: "Product detail or finish close-up",
      copy: "Perfect for material textures, manufacturing detail, premium stills, or side-by-side finish comparisons.",
    },
    {
      type: "video",
      label: "Video slot",
      title: "Configurator or UX capture",
      copy: "Show the interaction itself, from camera movement to option switching and mobile behavior.",
    },
    {
      type: "image",
      label: "Image slot",
      title: "Case-study or comparison visual",
      copy: "Reserve space for before and after layouts, annotated visuals, client proof, or performance snapshots.",
    },
  ],
  note:
    "These are intentional placeholder slots, so you can drop in final assets later without rebuilding the page structure.",
};

const FALLBACK_PLAYGROUND_REDIRECT = {
  eyebrow: "Playground",
  title: "The configurator now has its own proper home.",
  copy:
    "Rather than squeezing a demo into the middle of the Services page, we now send visitors into Playground where the interactive experience has room to breathe.",
  features: [
    {
      title: "A better place for interaction",
      copy: "Playground is built for testing materials, uploads, colors, and camera movement instead of acting as a tiny embedded preview.",
    },
    {
      title: "Clearer on mobile",
      copy: "The mobile-friendly editor flow now lives in one focused environment instead of competing with long-form marketing content.",
    },
    {
      title: "Easier to extend",
      copy: "New asset support, material tools, and future configurator features can grow there without overloading this page.",
    },
  ],
  primaryCta: "Open Playground",
  secondaryCta: "Start a project",
  previewLabel: "Playground preview",
  previewTitle: "A cleaner handoff from service story to product exploration",
  previewCopy:
    "Use this space to tease the experience, then send people into the full environment when they are ready to interact.",
  previewChips: ["Material switching", "Asset upload", "Mobile-friendly UI"],
  previewCards: [
    {
      title: "Upload models",
      copy: "Support for .glb, .gltf, .fbx, .dae, and .3ds files inside the editor.",
    },
    {
      title: "Tune finishes",
      copy: "RAL presets, custom color picking, and main/sub color combinations for multi-part products.",
    },
    {
      title: "Explore faster",
      copy: "A more focused workspace for orbiting, testing, and reviewing the product without long-form page distractions.",
    },
  ],
};

const FALLBACK_BOTTOM_CTA = {
  title: "Have a product that needs a clearer story?",
  copy: "Let's turn it into something people can understand, trust, and remember.",
};

function Services({ content }) {
  const { servicesPage, nav } = content;
  const servicesIntro = servicesPage.servicesIntro ?? FALLBACK_SERVICES_INTRO;
  const servicesStory = servicesPage.story ?? FALLBACK_SERVICES_STORY;
  const mediaShowcase = servicesPage.mediaShowcase ?? FALLBACK_MEDIA_SHOWCASE;
  const playgroundRedirect = servicesPage.playgroundRedirect ?? FALLBACK_PLAYGROUND_REDIRECT;
  const bottomCta = servicesPage.bottomCta ?? FALLBACK_BOTTOM_CTA;

  return (
    <main className="page-services">
      <section className="page-header section-block">
        <div className="container">
          <div className="services-header-grid">
            <div className="services-header-copy">
              <div className="eyebrow reveal">{servicesPage.eyebrow}</div>
              <h1 className="page-title reveal">{servicesPage.headline}</h1>
              <p className="page-subtitle reveal">{servicesPage.copy}</p>
            </div>

            <aside className="glass-card services-header-panel reveal">
              <span className="metric-label">{servicesStory.panelLabel}</span>
              <h2>{servicesStory.title}</h2>
              <p>{servicesStory.copy}</p>

              <div className="services-header-points">
                {servicesStory.points.map((point) => (
                  <div className="services-header-point" key={point.title}>
                    <strong>{point.title}</strong>
                    <span>{point.copy}</span>
                  </div>
                ))}
              </div>

              <p className="services-header-note">{servicesStory.note}</p>
            </aside>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="container">
          <div className="section-head reveal">
            <div className="eyebrow">{servicesIntro.eyebrow}</div>
            <h2>{servicesIntro.title}</h2>
            <p>{servicesIntro.copy}</p>
          </div>

          <div className="service-grid">
            {servicesPage.services.map((service, index) => (
              <article className="glass-card service-card reveal" key={service.title} style={{ transitionDelay: `${index * 0.06}s` }}>
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
        </div>
      </section>

      <MediaSlotsSection copy={mediaShowcase} className="services-media-section" />

      <section className="section-block services-playground-section">
        <div className="container">
          <div className="services-playground-grid">
            <div>
              <div className="section-head reveal">
                <div className="eyebrow">{playgroundRedirect.eyebrow}</div>
                <h2>{playgroundRedirect.title}</h2>
                <p>{playgroundRedirect.copy}</p>
              </div>

              <div className="services-playground-features">
                {playgroundRedirect.features.map((item, index) => (
                  <article className="glass-card services-playground-feature reveal" key={item.title} style={{ transitionDelay: `${index * 0.07}s` }}>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </article>
                ))}
              </div>

              <div className="services-playground-actions reveal">
                <Link className="primary-button" to="/playground">
                  {playgroundRedirect.primaryCta}
                </Link>
                <Link className="secondary-button" to="/contact">
                  {playgroundRedirect.secondaryCta ?? nav.cta}
                </Link>
              </div>
            </div>

            <article className="glass-card playground-preview-card reveal">
              <div className="playground-preview-bar">
                <div className="playground-preview-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="playground-preview-path">configuro.studio/playground</span>
              </div>

              <div className="playground-preview-body">
                <span className="metric-label">{playgroundRedirect.previewLabel}</span>
                <h3>{playgroundRedirect.previewTitle}</h3>
                <p>{playgroundRedirect.previewCopy}</p>

                <div className="playground-preview-chip-row">
                  {playgroundRedirect.previewChips.map((chip) => (
                    <span className="tag" key={chip}>
                      {chip}
                    </span>
                  ))}
                </div>

                <div className="playground-preview-grid">
                  {playgroundRedirect.previewCards.map((card) => (
                    <div className="playground-preview-block" key={card.title}>
                      <strong>{card.title}</strong>
                      <p>{card.copy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section-block process-section">
        <div className="container">
          <div className="section-head centered reveal">
            <div className="eyebrow">{servicesPage.process.eyebrow}</div>
            <h2>{servicesPage.process.title}</h2>
            <p>{servicesPage.process.copy}</p>
          </div>
          <div className="process-grid">
            {servicesPage.process.steps.map((step, index) => (
              <article className="glass-card process-card reveal" key={step.step} style={{ transitionDelay: `${index * 0.08}s` }}>
                <span className="process-step">{step.step}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block cta-section">
        <div className="container cta-container reveal">
          <h2>{bottomCta.title}</h2>
          <p>{bottomCta.copy}</p>
          <Link className="primary-button" to="/contact">
            {nav.cta}
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Services;
