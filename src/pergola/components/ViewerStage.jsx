import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ArrowCounterClockwise, Minus, Pause, Play, Plus, Stop } from "@phosphor-icons/react/dist/ssr";
import { track } from "../analytics.js";
import { useGuidedDemo } from "./useGuidedDemo.js";

const VIEWS = ["overview", "front", "side", "top", "inside", "detail"];
export const DEMO_EVENT = "configuro:guided-demo";
const POSTER = "/pergola-configurators/v2/img/poster";
export const ACTIVATE_EVENT = "configuro:viewer-activate";
// Read once at load: the page rewrites its own query string after hydration.
const DEBUG_3D = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("debug3d");

/** Starts loading the 3D engine early, e.g. when a CTA is hovered. */
export function preloadViewer() {
  import("../viewer/engine.js");
}

const ViewerStage = forwardRef(function ViewerStage({ config, t, onInteract, onKeepDemo }, ref) {
  const stageRef = useRef(null);
  const hostRef = useRef(null);
  const viewerRef = useRef(null);
  const configRef = useRef(config);
  configRef.current = config;
  const [status, setStatus] = useState("idle");
  const [sceneStatus, setSceneStatus] = useState("ready");
  const [view, setView] = useState("overview");
  const [attempt, setAttempt] = useState(0);
  const [touch, setTouch] = useState(false);
  const [manual, setManual] = useState(false);
  // The rotate hint only helps before the first touch; afterwards it is clutter.
  const [interacted, setInteracted] = useState(false);
  const [pendingDemo, setPendingDemo] = useState(false);
  const demo = useGuidedDemo({ viewerRef, configRef, onKeep: onKeepDemo });

  useImperativeHandle(ref, () => ({ snapshot: (caption) => viewerRef.current?.snapshot(caption) ?? null, ready: () => Boolean(viewerRef.current) }), []);

  useEffect(() => {
    setTouch(matchMedia("(pointer: coarse)").matches);
    setManual(Boolean(navigator.connection?.saveData));
  }, []);

  // Activation: an explicit request (CTA, first control change) starts the
  // engine at once. Scrolling near the stage starts it once the page has
  // finished loading and the main thread is idle, so the 3D work never
  // competes with first paint. Data Saver waits for a tap instead.
  useEffect(() => {
    if (status !== "idle") return undefined;
    const saveData = navigator.connection?.saveData;
    let idleHandle = 0;
    let done = false;
    const start = () => { if (!done) { done = true; setStatus("loading"); } };
    const startWhenIdle = () => {
      const schedule = () => { idleHandle = "requestIdleCallback" in window ? requestIdleCallback(start, { timeout: 2500 }) : setTimeout(start, 300); };
      if (document.readyState === "complete") schedule();
      else window.addEventListener("load", schedule, { once: true });
    };
    window.addEventListener(ACTIVATE_EVENT, start);
    let observer;
    if (!saveData) {
      observer = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) { observer.disconnect(); startWhenIdle(); } }, { rootMargin: "0px 0px 160px 0px" });
      observer.observe(stageRef.current);
    }
    return () => {
      window.removeEventListener(ACTIVATE_EVENT, start);
      observer?.disconnect();
      if ("cancelIdleCallback" in window) cancelIdleCallback(idleHandle); else clearTimeout(idleHandle);
    };
  }, [status]);

  useEffect(() => {
    if (status !== "loading") return undefined;
    let cancelled = false;
    import("../viewer/engine.js").then(({ PergolaViewer, supportsWebGL }) => {
      if (cancelled) return;
      if (!supportsWebGL()) { setStatus("error"); return; }
      try {
        viewerRef.current = new PergolaViewer(hostRef.current, {
          config: configRef.current,
          label: t.viewerLabel,
          onStatus: (next) => { if (!cancelled) setStatus(next); },
          onSceneStatus: (next) => { if (!cancelled) setSceneStatus(next); },
        });
        // QA hook: ?debug3d exposes the viewer for browser inspection.
        if (DEBUG_3D) window.__pergolaViewer = viewerRef.current;
      } catch (error) {
        console.warn("Pergola viewer could not start", error);
        setStatus("error");
      }
    }).catch(() => { if (!cancelled) setStatus("error"); });
    return () => {
      cancelled = true;
      viewerRef.current?.dispose();
      viewerRef.current = null;
    };
    // `attempt` restarts the viewer after an error.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status === "loading" || status === "ready", attempt]);

  // A change to the visitor's design ends a running demo; stop() puts the
  // design (already the new one) back on the model.
  const demoRef = useRef(demo);
  demoRef.current = demo;
  useEffect(() => {
    if (demoRef.current.active && demoRef.current.state !== "finished") demoRef.current.stop("interaction");
    else viewerRef.current?.setConfig(config);
  }, [config]);

  // Guided demo requests from anywhere on the page. If the engine is not up
  // yet, start it and run the demo once it is ready.
  useEffect(() => {
    const onDemo = () => {
      if (viewerRef.current && status === "ready") demoRef.current.start();
      else { setPendingDemo(true); setStatus((current) => (current === "idle" || current === "error" ? "loading" : current)); }
    };
    window.addEventListener(DEMO_EVENT, onDemo);
    return () => window.removeEventListener(DEMO_EVENT, onDemo);
  }, [status]);
  useEffect(() => {
    if (status === "ready" && pendingDemo) { setPendingDemo(false); demoRef.current.start(); }
  }, [status, pendingDemo]);

  const interrupt = () => { if (demo.active && demo.state !== "finished") demo.stop("interaction"); };

  const setCamera = (next) => {
    interrupt();
    setView(next);
    viewerRef.current?.setView(next);
    onInteract?.();
  };

  function onKeyDown(event) {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const actions = {
      ArrowLeft: () => viewer.rotateBy(-0.18),
      ArrowRight: () => viewer.rotateBy(0.18),
      ArrowUp: () => viewer.rotateBy(0, -0.12),
      ArrowDown: () => viewer.rotateBy(0, 0.12),
      "+": () => viewer.zoomBy(0.85),
      "=": () => viewer.zoomBy(0.85),
      "-": () => viewer.zoomBy(1.18),
      Home: () => setCamera("overview"),
    };
    if (!actions[event.key]) return;
    event.preventDefault();
    interrupt();
    actions[event.key]();
    onInteract?.();
  }

  const ready = status === "ready";
  return (
    <div className="pc-stage" ref={stageRef} data-status={status} data-time={config.time}>
      <picture className="pc-poster" aria-hidden={ready ? "true" : undefined}>
        <source type="image/avif" srcSet={`${POSTER}-960.avif 960w, ${POSTER}-1440.avif 1440w`} sizes="(min-width: 1024px) 60vw, 100vw" />
        <img src={`${POSTER}-960.webp`} srcSet={`${POSTER}-960.webp 960w, ${POSTER}-1440.webp 1440w`} sizes="(min-width: 1024px) 60vw, 100vw" alt={ready ? "" : t.posterAlt} width="1440" height="1080" loading="lazy" decoding="async" />
      </picture>
      <div
        className="pc-host"
        ref={hostRef}
        tabIndex={ready ? 0 : -1}
        role="application"
        aria-roledescription="3D viewer"
        aria-label={t.viewerLabel}
        aria-describedby="pc-viewer-keys"
        onKeyDown={onKeyDown}
        onPointerDown={() => { interrupt(); setInteracted(true); onInteract?.(); track("configurator_rotate", {}, { once: true }); }}
        onWheel={interrupt}
      />
      <p id="pc-viewer-keys" className="pc-sr">{t.viewerKeys}</p>

      {ready && (
        <>
          <div className="pc-stage-bar" role="group" aria-label={t.camera}>
            {VIEWS.map((name) => (
              <button key={name} type="button" className="pc-chip" aria-pressed={view === name} onClick={() => setCamera(name)}>{t.views[name]}</button>
            ))}
          </div>
          <div className="pc-stage-zoom">
            <button type="button" className="pc-icon-btn" aria-label={t.zoomIn} onClick={() => viewerRef.current?.zoomBy(0.85)}><Plus size={18} weight="bold" aria-hidden="true" /></button>
            <button type="button" className="pc-icon-btn" aria-label={t.zoomOut} onClick={() => viewerRef.current?.zoomBy(1.18)}><Minus size={18} weight="bold" aria-hidden="true" /></button>
            <button type="button" className="pc-icon-btn" aria-label={t.resetView} onClick={() => setCamera("overview")}><ArrowCounterClockwise size={18} weight="bold" aria-hidden="true" /></button>
          </div>
          {!demo.active && (
            <div className="pc-stage-demo">
              <button type="button" className="pc-chip pc-demo-btn" aria-label={t.demoPlay} onClick={() => demo.start()}><Play size={14} weight="fill" aria-hidden="true" /><span className="pc-demo-long">{t.demoPlay}</span><span className="pc-demo-short" aria-hidden="true">{t.demoLabel}</span></button>
              {!interacted && <p className="pc-stage-hint" aria-hidden="true">{touch ? t.viewerHintTouch : t.viewerHintPointer}</p>}
            </div>
          )}
        </>
      )}
      {demo.active && (
        <div className="pc-demo-bar" role="region" aria-label={t.demoLabel}>
          <p aria-live="polite">{demo.state === "finished" ? t.demoFinished : t.demoSteps[demo.caption]}</p>
          <div className="pc-demo-actions">
            {demo.state === "finished" ? (
              <>
                <button type="button" className="pc-chip-btn" onClick={demo.keep}>{t.demoKeep}</button>
                <button type="button" className="pc-chip-btn" onClick={() => demo.stop("restore")}>{t.demoRestore}</button>
              </>
            ) : (
              <>
                {demo.state === "paused"
                  ? <button type="button" className="pc-chip-btn" onClick={demo.resume}><Play size={14} weight="fill" aria-hidden="true" />{t.demoResume}</button>
                  : <button type="button" className="pc-chip-btn" onClick={demo.pause}><Pause size={14} weight="fill" aria-hidden="true" />{t.demoPause}</button>}
                <button type="button" className="pc-chip-btn" onClick={() => demo.stop("button")}><Stop size={14} weight="fill" aria-hidden="true" />{t.demoStop}</button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="pc-stage-status" role="status" aria-live="polite">
        {status === "loading" && <span className="pc-loading"><span className="pc-loading-bar" aria-hidden="true" />{t.viewerLoading}</span>}
        {ready && sceneStatus === "loading" && <span className="pc-loading"><span className="pc-loading-bar" aria-hidden="true" />{t.viewerSceneLoading}</span>}
        {ready && sceneStatus === "error" && <span className="pc-pill-note">{t.viewerSceneError}</span>}
      </div>
      {status === "idle" && manual && (
        <button type="button" className="pc-btn pc-btn-secondary pc-stage-start" onClick={() => setStatus("loading")}>{t.viewerStart}</button>
      )}
      {status === "error" && (
        <div className="pc-stage-error" role="alert">
          <p>{t.viewerError}</p>
          <button type="button" className="pc-btn pc-btn-secondary" onClick={() => { setAttempt((n) => n + 1); setStatus("loading"); }}>{t.viewerRetry}</button>
        </div>
      )}
    </div>
  );
});

export default ViewerStage;
