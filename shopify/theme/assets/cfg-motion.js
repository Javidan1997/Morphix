const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let dispose;

function mount() {
  dispose?.();
  const controller = new AbortController();
  const { signal } = controller;
  const hero = document.querySelector('[data-motion-hero]');
  if (!hero) return;
  const video = hero.querySelector('video');
  const toggle = hero.querySelector('[data-motion-toggle]');
  const editorial = document.querySelector('.motion-editorial');
  const row = document.querySelector('[data-drift-row]');
  const scene = document.querySelector('[data-motion-scene]');
  const panels = [...document.querySelectorAll('[data-scene-panel]')];
  const collection = document.querySelector('.brand-edito .motion-collection');
  const rail = collection?.querySelector('.motion-collection__rail');
  let paused = false;
  let frame = 0;
  let desiredTime = 0;
  let active = !document.hidden;
  const clamp = (n) => Math.max(0, Math.min(1, n));
  const moving = () => !paused && !reduced.matches;
  const progress = (element) => {
    const rect = element.getBoundingClientRect();
    return clamp(-rect.top / Math.max(1, rect.height - innerHeight));
  };
  const seek = () => {
    if (!moving() || video.seeking || !Number.isFinite(video.duration) || video.readyState < 2) return;
    if (Math.abs(video.currentTime - desiredTime) > 0.035) video.currentTime = desiredTime;
  };
  const update = () => {
    frame = 0;
    if (!moving() || !active) return;
    const p = progress(hero);
    hero.style.setProperty('--hero-progress', p);
    if (video.duration) {
      desiredTime = p * Math.max(0, video.duration - 0.05);
      seek();
    }
    if (editorial && row) {
      const r = editorial.getBoundingClientRect();
      const drift = clamp((innerHeight - r.top) / (r.height + innerHeight)) - 0.5;
      row.style.setProperty('--drift', `${drift * (innerWidth < 760 ? 64 : 160)}px`);
    }
    if (scene) {
      const p = progress(scene);
      panels.forEach((panel, index) => {
        panel.style.setProperty('--slide', `${index === 0 ? 0 : (1 - clamp(p * (panels.length - 1) - (index - 1))) * 100}%`);
      });
    }
    if (collection && rail && innerWidth >= 760) {
      const distance = Math.max(0, rail.scrollWidth - innerWidth);
      collection.style.setProperty('--collection-shift', `${-progress(collection) * distance}px`);
    }
  };
  const request = () => { if (!frame) frame = requestAnimationFrame(update); };
  const setMode = () => {
    document.documentElement.classList.toggle('motion-ready', moving());
    document.documentElement.classList.toggle('motion-still', !moving());
    toggle.textContent = moving() ? toggle.dataset.pauseLabel : toggle.dataset.resumeLabel;
    toggle.setAttribute('aria-pressed', String(!moving()));
    toggle.hidden = reduced.matches;
    video.pause();
    request();
  };
  toggle.addEventListener('click', () => { paused = !paused; setMode(); }, { signal });
  reduced.addEventListener('change', setMode, { signal });
  collection?.addEventListener('focusin', (event) => {
    if (!moving() || innerWidth < 760 || !rail) return;
    const product = event.target.closest('.motion-product');
    if (!product) return;
    const rect = product.getBoundingClientRect();
    if (rect.left >= 0 && rect.right <= innerWidth) return;
    const distance = Math.max(1, rail.scrollWidth - innerWidth);
    const ratio = clamp((product.offsetLeft - 40) / distance);
    const top = collection.getBoundingClientRect().top + scrollY + ratio * (collection.offsetHeight - innerHeight);
    scrollTo({ top, behavior: 'instant' });
  }, { signal });
  addEventListener('scroll', request, { passive: true, signal });
  addEventListener('resize', request, { passive: true, signal });
  document.addEventListener('visibilitychange', () => { active = !document.hidden; if (active) request(); }, { signal });
  video.addEventListener('seeked', seek, { signal });
  video.addEventListener('loadeddata', () => { video.classList.add('is-ready'); request(); }, { signal });
  video.addEventListener('error', () => video.classList.remove('is-ready'), { signal });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      target.classList.add('is-visible');
      observer.unobserve(target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-motion-reveal], .motion-product').forEach((el) => observer.observe(el));
  const loadVideo = () => {
    if (!moving() || navigator.connection?.saveData || video.dataset.loaded) return;
    video.dataset.loaded = 'true';
    video.querySelectorAll('source[data-src]').forEach((source) => { source.src = source.dataset.src; });
    video.load();
  };
  video.addEventListener('canplay', request, { signal });
  toggle.addEventListener('click', loadVideo, { signal });
  reduced.addEventListener('change', loadVideo, { signal });
  setMode();
  loadVideo();
  dispose = () => {
    controller.abort();
    observer.disconnect();
    cancelAnimationFrame(frame);
    video.pause();
    document.documentElement.classList.remove('motion-ready', 'motion-still');
  };
}

mount();
document.addEventListener('shopify:section:load', mount);
document.addEventListener('shopify:section:unload', mount);
