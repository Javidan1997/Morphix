// Shared motion helpers. Durations and easing live in pergola.css as tokens
// (--pc-dur-control, --pc-dur-reveal, --pc-dur-scene, --pc-stagger); these
// hooks only decide *whether* motion runs.
import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/** Tracks prefers-reduced-motion, including changes while the page is open. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = matchMedia(QUERY);
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced;
}

/**
 * Reveals [data-reveal] elements once as they enter the viewport. Content is
 * visible by default; the hidden start state only applies after this hook adds
 * `pc-motion` to <html>, so nothing stays hidden if scripts or motion fail.
 */
export function useRevealOnce() {
  useEffect(() => {
    const media = matchMedia(QUERY);
    const root = document.documentElement;
    let observer;
    const start = () => {
      observer?.disconnect();
      const nodes = [...document.querySelectorAll("[data-reveal]:not([data-revealed])")];
      if (media.matches) {
        root.classList.remove("pc-motion");
        return;
      }
      root.classList.add("pc-motion");
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        }
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      for (const node of nodes) {
        if (node.getBoundingClientRect().top < window.innerHeight * 0.92) node.setAttribute("data-revealed", "");
        else observer.observe(node);
      }
    };
    start();
    media.addEventListener("change", start);
    return () => { observer?.disconnect(); media.removeEventListener("change", start); };
  }, []);
}

/** Index of the child section currently crossing the middle of the viewport. */
export function useActiveSection(refs, count) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const nodes = refs.current.slice(0, count).filter(Boolean);
    if (!nodes.length) return undefined;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActive(Number(entry.target.dataset.index));
      }
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [refs, count]);
  return [active, setActive];
}

export const scrollBehavior = () => (matchMedia(QUERY).matches ? "auto" : "smooth");
