import { useEffect, useState } from 'react';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Reveals every [data-reveal] element once as it scrolls into view.
 *
 * The observer is rebuilt whenever `deps` change, because switching language or
 * package swaps whole subtrees and the new nodes need picking up. Elements that
 * have already played keep their state, so nothing re-animates on a re-render.
 */
export function useReveal(deps = []) {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('[data-reveal]:not([data-revealed])'));
    if (!nodes.length) return;
    if (reduced() || typeof IntersectionObserver === 'undefined') {
      nodes.forEach(node => node.setAttribute('data-revealed', ''));
      return;
    }
    const observer = new IntersectionObserver((entries, self) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute('data-revealed', '');
        self.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** True once the window has scrolled past `offset`, for the condensing header. */
export function useScrolled(offset = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > offset));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); };
  }, [offset]);
  return scrolled;
}

/**
 * Counts a number up when its element first becomes visible. Used for the
 * price figures, which otherwise arrive with no sense of arrival at all.
 */
export function useCountUp(value, { duration = 900 } = {}) {
  const [node, setNode] = useState(null);
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (!node) return;
    if (reduced() || typeof IntersectionObserver === 'undefined') { setShown(value); return; }
    let frame = 0;
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = now => {
        const t = Math.min(1, (now - start) / duration);
        setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    observer.observe(node);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [node, value, duration]);
  return [setNode, shown];
}
