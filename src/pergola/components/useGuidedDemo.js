import { useCallback, useEffect, useRef, useState } from "react";
import { SIDES, normalizeConfig } from "../configModel.js";
import { track } from "../analytics.js";

// A 13-second, user-started walkthrough in the existing viewer. It previews a
// demonstration setup on the 3D model only: the visitor's saved design (page
// state, URL, summary) is untouched until they choose to keep the result.
const DEMO_RATE = 2.2;

function demoBase(config) {
  const sides = { ...config.sides };
  // Glass on the front and a screen on a free side, so both movements show.
  if (sides.front === "none") sides.front = "sliding";
  const screenSide = SIDES.find((side) => side !== "front" && side !== "rear" && sides[side] === "none");
  if (screenSide && !SIDES.some((side) => sides[side] === "zip")) sides[screenSide] = "zip";
  return normalizeConfig({ ...config, sides, roof: 0, slidingOpen: 0, zipOpen: 100, led: "off" });
}

const STEPS = [
  { at: 0, caption: 0, view: "roof", apply: (c) => c },
  { at: 1500, caption: 1, apply: (c) => ({ ...c, roof: 90 }) },
  { at: 4000, apply: (c) => ({ ...c, roof: 35 }) },
  { at: 5400, caption: 2, view: "front", apply: (c) => ({ ...c, slidingOpen: 75 }) },
  { at: 8000, caption: 3, apply: (c) => ({ ...c, zipOpen: 0 }) },
  { at: 10200, caption: 4, view: "overview", apply: (c) => ({ ...c, led: "warm", ledLevel: 90, time: "night" }) },
  { at: 13200, finish: true },
];

export function useGuidedDemo({ viewerRef, configRef, onKeep }) {
  const [state, setState] = useState("idle"); // idle | playing | paused | finished
  const [caption, setCaption] = useState(0);
  const run = useRef({ index: 0, elapsed: 0, startedAt: 0, timer: 0, config: null });

  const clear = () => clearTimeout(run.current.timer);

  const schedule = useCallback(() => {
    const r = run.current;
    const step = STEPS[r.index];
    if (!step) return;
    const wait = Math.max(0, step.at - r.elapsed);
    r.startedAt = performance.now() - r.elapsed;
    r.timer = setTimeout(() => {
      const viewer = viewerRef.current;
      if (!viewer) return;
      r.elapsed = step.at;
      if (step.finish) {
        setState("finished");
        viewer.setAnimationRate(9);
        track("guided_demo_complete");
        return;
      }
      r.config = normalizeConfig(step.apply(r.config));
      viewer.setConfig(r.config);
      if (step.view) viewer.setView(step.view, { duration: 1400 });
      if (step.caption !== undefined) setCaption(step.caption);
      r.index += 1;
      schedule();
    }, wait);
  }, [viewerRef]);

  const start = useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer) return false;
    clear();
    run.current = { index: 0, elapsed: 0, startedAt: performance.now(), timer: 0, config: demoBase(configRef.current) };
    viewer.setAnimationRate(DEMO_RATE);
    setCaption(0);
    setState("playing");
    track("guided_demo_start");
    schedule();
    return true;
  }, [viewerRef, configRef, schedule]);

  const pause = useCallback(() => {
    if (state !== "playing") return;
    clear();
    run.current.elapsed = performance.now() - run.current.startedAt;
    // Freeze openings mid-movement so Pause really pauses.
    viewerRef.current?.setAnimationRate(0);
    setState("paused");
  }, [state, viewerRef]);

  const resume = useCallback(() => {
    if (state !== "paused") return;
    viewerRef.current?.setAnimationRate(DEMO_RATE);
    setState("playing");
    schedule();
  }, [state, viewerRef, schedule]);

  /** Ends the demo and puts the visitor's own design back on the model. */
  const stop = useCallback((reason = "button") => {
    if (state === "idle") return;
    clear();
    const viewer = viewerRef.current;
    viewer?.setAnimationRate(9);
    viewer?.setConfig(configRef.current);
    viewer?.setView("overview");
    if (state !== "finished") track("guided_demo_stop", { method: reason });
    setState("idle");
  }, [state, viewerRef, configRef]);

  const keep = useCallback(() => {
    const demoConfig = run.current.config;
    clear();
    viewerRef.current?.setAnimationRate(9);
    setState("idle");
    track("guided_demo_keep");
    if (demoConfig) onKeep(demoConfig);
  }, [viewerRef, onKeep]);

  // A hidden tab pauses the walkthrough instead of letting it run unseen.
  useEffect(() => {
    const onHidden = () => { if (document.hidden) pause(); };
    document.addEventListener("visibilitychange", onHidden);
    return () => document.removeEventListener("visibilitychange", onHidden);
  }, [pause]);

  useEffect(() => () => clear(), []);

  return { state, caption, start, pause, resume, stop, keep, active: state !== "idle" };
}
