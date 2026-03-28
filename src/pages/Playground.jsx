import { Link } from "react-router-dom";
import PlaygroundExperience from "../components/PlaygroundExperience";

const LAB_TRACKS = [
  {
    title: "Designer review lane",
    copy:
      "Pressure-test composition, finish direction, staging, and storytelling before committing anything to production.",
  },
  {
    title: "3D developer sandbox",
    copy:
      "Swap models, validate GLB behavior, experiment with controls, and check camera logic in a production-shaped shell.",
  },
  {
    title: "AR / VR handoff",
    copy:
      "Launch WebXR sessions on supported devices to verify whether a scene is presentation-ready before broader rollout.",
  },
  {
    title: "Delivery checklist",
    copy:
      "Keep a shared list of assets, environments, and interaction ideas so the team knows exactly what to add next.",
  },
];

const WORKFLOWS = [
  {
    title: "For designers",
    points: [
      "Test composition with real camera behavior instead of static mockups.",
      "Validate materials and staging in multiple environments.",
      "Review interaction pacing before motion specs are locked.",
    ],
  },
  {
    title: "For 3D developers",
    points: [
      "Use real GLB assets and confirm they scale cleanly inside the viewer.",
      "Check controls, state transitions, and lighting presets in one place.",
      "Prepare AR and VR sessions with the same scene logic used on the web.",
    ],
  },
  {
    title: "For product teams",
    points: [
      "See which options, scenes, and storytelling angles feel strongest fastest.",
      "Keep technical and visual decisions in one shared review loop.",
      "Turn experiments into implementation-ready direction without rebriefing.",
    ],
  },
];

const ASSET_REQUESTS = [
  {
    title: "3D models to add later",
    items: [
      "Primary hero GLB or GLTF with production-ready topology",
      "Variant-ready materials or texture sets",
      "Optional exploded, open, or detail states for storytelling",
    ],
  },
  {
    title: "Environment kit",
    items: [
      "HDRIs for showroom, studio, retail, and immersive modes",
      "Floor / pedestal / prop packs for staging experiments",
      "Brand-specific lighting references or art direction boards",
    ],
  },
  {
    title: "Interaction extensions",
    items: [
      "Annotations, hotspots, or guided tours",
      "Variant logic, pricing logic, or CMS-fed product data",
      "Animation clips for open-close, explode, or assembly flows",
    ],
  },
  {
    title: "XR readiness pack",
    items: [
      "AR-safe scale references and origin placement",
      "VR interaction targets or controller-safe hit areas",
      "Device test list for Safari, Chrome Android, and headset browsers",
    ],
  },
];

function Playground({ content }) {
  const { heroConfiguratorProducts, configuratorDemo, nav } = content;

  return (
    <main className="page-playground">
      <section className="page-header section-block playground-header">
        <div className="container">
          <div className="playground-hero-shell glass-card reveal">
            <div className="playground-hero-copy">
              <div className="eyebrow">Playground</div>
              <h1 className="page-title">A serious experimentation space for designers and 3D developers.</h1>
              <p className="page-subtitle playground-subtitle">
                Use one high-trust workspace to test product staging, validate GLB behavior, explore materials, and launch AR or VR sessions on supported devices.
              </p>

              <div className="playground-hero-actions">
                <a className="primary-button" href="#playground-lab">
                  Enter the lab
                </a>
                <Link className="secondary-button" to="/contact">
                  {nav.cta}
                </Link>
              </div>

              <div className="playground-chip-row">
                <span className="chip">WebXR-ready</span>
                <span className="chip">Designer + dev workflow</span>
                <span className="chip">Real GLB staging</span>
              </div>
            </div>

            <div className="playground-hero-metrics">
              <article className="playground-metric-card">
                <span className="metric-label">Modes</span>
                <strong>Web, AR, VR</strong>
                <p>One viewer shell for exploration, review, and immersive testing.</p>
              </article>
              <article className="playground-metric-card">
                <span className="metric-label">Built for</span>
                <strong>Real asset iteration</strong>
                <p>Swap models, scene presets, finishes, and camera intent without rebuilding the page structure.</p>
              </article>
              <article className="playground-metric-card">
                <span className="metric-label">Next step</span>
                <strong>Add your own kits later</strong>
                <p>Bring new GLBs, environments, animation clips, and XR-specific references when you are ready.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block playground-track-section">
        <div className="container">
          <div className="playground-track-grid">
            {LAB_TRACKS.map((track, index) => (
              <article
                className="glass-card playground-track-card reveal"
                key={track.title}
                style={{ transitionDelay: `${index * 0.06}s` }}
              >
                <span className="metric-label">Track 0{index + 1}</span>
                <h3>{track.title}</h3>
                <p>{track.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block playground-lab-section" id="playground-lab">
        <div className="container">
          <div className="section-head reveal">
            <div className="eyebrow">Live Lab</div>
            <h2>Experiment with product scenes in an editor-style workspace.</h2>
            <p>
              Switch assets, upload your own GLBs, tune render modes, inspect scene data, use transform gizmos, and launch AR or VR on supported hardware. The goal is a real working lab, not a dressed-up demo.
            </p>
          </div>

          <PlaygroundExperience
            libraryProducts={heroConfiguratorProducts}
            viewerText={configuratorDemo.shell.viewer}
          />
        </div>
      </section>

      <section className="section-block playground-workflow-section">
        <div className="container">
          <div className="section-head centered reveal">
            <div className="eyebrow">Workflow</div>
            <h2>One page for review, iteration, and handoff.</h2>
            <p>
              Keep design, 3D, and implementation conversations in the same workspace so every experiment stays concrete and reviewable.
            </p>
          </div>

          <div className="playground-workflow-grid">
            {WORKFLOWS.map((workflow, index) => (
              <article
                className="glass-card playground-workflow-card reveal"
                key={workflow.title}
                style={{ transitionDelay: `${index * 0.08}s` }}
              >
                <span className="metric-label">Workflow 0{index + 1}</span>
                <h3>{workflow.title}</h3>
                <ul className="playground-note-list">
                  {workflow.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block playground-assets-section">
        <div className="container">
          <div className="glass-card playground-assets-shell reveal">
            <div className="section-head">
              <div className="eyebrow">Asset Intake</div>
              <h2>What to add later when you are ready.</h2>
              <p>
                The page is ready right now. When you start dropping in production assets, this is the list that will expand the lab without changing the core page architecture.
              </p>
            </div>

            <div className="playground-assets-grid">
              {ASSET_REQUESTS.map((group, index) => (
                <article
                  className="playground-asset-card"
                  key={group.title}
                  style={{ transitionDelay: `${index * 0.05}s` }}
                >
                  <h3>{group.title}</h3>
                  <ul className="playground-note-list">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-block cta-section">
        <div className="container cta-container reveal">
          <h2>Want this lab tuned around your own product stack?</h2>
          <p>Bring your models, environments, and interaction ideas. We can turn the playground into a client-specific review and launch workspace.</p>
          <Link className="primary-button" to="/contact">
            {nav.cta}
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Playground;
