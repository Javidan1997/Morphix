// ReactBits-style interaction layer for the public site.
// Two entry points:
//   initGlobalEffects()  -> run once on mount (persistent chrome: progress bar, grain, dot-grid)
//   initCinematicEffects() -> run per route (magnetic, tilt, countup, split-text, scramble, shine)
// Both return a cleanup function. Everything honors prefers-reduced-motion and
// throttles pointer handlers via requestAnimationFrame.

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function rafThrottle(fn) {
  let queued = false;
  let lastArgs;
  return (...args) => {
    lastArgs = args;
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; fn(...lastArgs); });
  };
}

/* ============================ GLOBAL (once) ============================ */
export function initGlobalEffects() {
  const cleanups = [];
  const reduce = reducedMotion();

  // Scroll-progress indicator
  if (!document.getElementById("cin-progress")) {
    const bar = document.createElement("div");
    bar.id = "cin-progress";
    document.body.appendChild(bar);
    const onScroll = rafThrottle(() => {
      const d = document.documentElement;
      const max = (d.scrollHeight - window.innerHeight) || 1;
      const p = Math.min(1, Math.max(0, (window.scrollY || d.scrollTop) / max));
      bar.style.transform = `scaleX(${p})`;
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    cleanups.push(() => { window.removeEventListener("scroll", onScroll); bar.remove(); });
  }

  // Animated grain overlay (CSS-driven)
  if (!document.getElementById("cin-grain")) {
    const g = document.createElement("div");
    g.id = "cin-grain";
    document.body.appendChild(g);
    cleanups.push(() => g.remove());
  }

  // Interactive dot grid that brightens near the cursor
  if (!reduce && !document.getElementById("cin-dots")) {
    const c = document.createElement("canvas");
    c.id = "cin-dots";
    document.body.appendChild(c);
    const x = c.getContext("2d");
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let w, h, dots = [], mx = -9999, my = -9999, raf = 0;
    const build = () => {
      w = c.width = window.innerWidth * DPR;
      h = c.height = window.innerHeight * DPR;
      c.style.width = window.innerWidth + "px";
      c.style.height = window.innerHeight + "px";
      const gap = 48 * DPR;
      dots = [];
      for (let yy = gap; yy < h; yy += gap)
        for (let xx = gap; xx < w; xx += gap) dots.push({ x: xx, y: yy });
    };
    const onMove = (e) => { mx = e.clientX * DPR; my = e.clientY * DPR; };
    const draw = () => {
      x.clearRect(0, 0, w, h);
      for (const d of dots) {
        const dist = Math.hypot(d.x - mx, d.y - my);
        let a = 0.55 - dist / (240 * DPR);
        if (a < 0.035) a = 0.035;
        x.fillStyle = `rgba(91,120,255,${a})`;
        x.beginPath();
        x.arc(d.x, d.y, 1.4 * DPR, 0, 7);
        x.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    build();
    draw();
    window.addEventListener("resize", build);
    window.addEventListener("pointermove", onMove, { passive: true });
    cleanups.push(() => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", build);
      window.removeEventListener("pointermove", onMove);
      c.remove();
    });
  }

  return () => cleanups.forEach((fn) => fn());
}

/* ============================ PER ROUTE ============================ */
export function initCinematicEffects(root = document) {
  const cleanups = [];
  const reduce = reducedMotion();

  // Magnetic buttons + nav links
  if (!reduce) {
    root.querySelectorAll(".primary-button, .secondary-button, .nav-cta, .nav-links a").forEach((b) => {
      const strength = b.classList.contains("nav-links") || b.closest(".nav-links") ? 0.18 : 0.3;
      const mm = rafThrottle((e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * strength}px, ${(e.clientY - (r.top + r.height / 2)) * strength}px)`;
      });
      const ml = () => { b.style.transform = ""; };
      b.addEventListener("mousemove", mm);
      b.addEventListener("mouseleave", ml);
      cleanups.push(() => { b.removeEventListener("mousemove", mm); b.removeEventListener("mouseleave", ml); b.style.transform = ""; });
    });
  }

  // Cards: 3D tilt + spotlight glare
  root.querySelectorAll(".value-card, .service-preview-card, .portfolio-preview-card, .glass-card, .trust-item, .pricing-card, .work-card, .principle-card, .step-card, .template-card").forEach((c) => {
    c.classList.add("cin-card");
    const mm = rafThrottle((e) => {
      const r = c.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      c.style.setProperty("--mx", (px * 100) + "%");
      c.style.setProperty("--my", (py * 100) + "%");
      if (!reduce) c.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 6}deg) translateZ(4px)`;
    });
    const ml = () => { c.style.transform = ""; };
    c.addEventListener("mousemove", mm);
    c.addEventListener("mouseleave", ml);
    cleanups.push(() => { c.removeEventListener("mousemove", mm); c.removeEventListener("mouseleave", ml); c.classList.remove("cin-card"); c.style.transform = ""; });
  });

  // CountUp on metrics (runs even with reduced motion — just snaps quickly)
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const el = e.target;
    const m = el.textContent.trim().match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
    if (!m) return;
    const pre = m[1], num = parseFloat(m[2]), suf = m[3];
    const dur = reduce ? 1 : 1100;
    const t0 = performance.now();
    const step = (t) => {
      const r = Math.min(1, (t - t0) / dur);
      const e2 = 1 - Math.pow(1 - r, 3);
      el.textContent = pre + Math.round(num * e2) + suf;
      if (r < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold: 0.6 });
  root.querySelectorAll(".trust-item strong, [data-countup]").forEach((el) => io.observe(el));
  cleanups.push(() => io.disconnect());

  // Sticky scroll-pin sequence: highlight the process step nearest viewport center
  const pcards = [...root.querySelectorAll(".process-section .process-card")];
  if (pcards.length) {
    const pio = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        pcards.forEach((c) => c.classList.remove("cin-active"));
        e.target.classList.add("cin-active");
      }
    }), { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    pcards.forEach((c) => pio.observe(c));
    cleanups.push(() => { pio.disconnect(); pcards.forEach((c) => c.classList.remove("cin-active")); });
  }

  // Split-text reveal on the hero headline (words stagger up)
  const hh = root.querySelector(".hero-headline");
  if (hh && !hh.dataset.cinSplit) {
    hh.dataset.cinSplit = "1";
    const original = hh.innerHTML;
    cleanups.push(() => { hh.innerHTML = original; delete hh.dataset.cinSplit; });
    if (!reduce) {
      const words = hh.textContent.split(/\s+/).filter(Boolean);
      hh.innerHTML = "";
      words.forEach((wd, i) => {
        const wrap = document.createElement("span");
        wrap.className = "cin-word";
        const inner = document.createElement("span");
        inner.className = "cin-word-inner";
        inner.textContent = wd;
        inner.style.transitionDelay = (i * 0.05) + "s";
        wrap.appendChild(inner);
        hh.appendChild(wrap);
        hh.appendChild(document.createTextNode(" "));
      });
      requestAnimationFrame(() => requestAnimationFrame(() => hh.classList.add("cin-split-in")));
    }
    hh.classList.add("cin-shine");
    cleanups.push(() => hh.classList.remove("cin-shine", "cin-split-in"));
  }

  // Scramble/decrypt effect on eyebrow labels
  if (!reduce) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&/<>0123456789";
    root.querySelectorAll(".eyebrow").forEach((el) => {
      if (el.dataset.cinScramble) return;
      el.dataset.cinScramble = "1";
      const original = el.textContent;
      let intervalId = 0;
      const obs = new IntersectionObserver((es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        obs.unobserve(el);
        let i = 0;
        intervalId = window.setInterval(() => {
          el.textContent = original.split("").map((ch, idx) => (idx < i || ch === " ") ? ch : chars[Math.floor(Math.random() * chars.length)]).join("");
          i += 0.5;
          if (i >= original.length) { window.clearInterval(intervalId); el.textContent = original; }
        }, 35);
      }), { threshold: 1 });
      obs.observe(el);
      cleanups.push(() => { window.clearInterval(intervalId); obs.disconnect(); el.textContent = original; delete el.dataset.cinScramble; });
    });
  }

  // Parallax layers — elements with data-parallax drift gently on scroll
  if (!reduce) {
    const pels = [...root.querySelectorAll("[data-parallax]")];
    if (pels.length) {
      const onScroll = rafThrottle(() => {
        const vh = window.innerHeight;
        for (const el of pels) {
          const speed = parseFloat(el.getAttribute("data-parallax")) || 20;
          const r = el.getBoundingClientRect();
          const off = ((r.top + r.height / 2) - vh / 2) / vh;
          el.style.transform = `translateY(${-off * speed}px)`;
        }
      });
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      cleanups.push(() => { window.removeEventListener("scroll", onScroll); pels.forEach((el) => { el.style.transform = ""; }); });
    }
  }

  return () => cleanups.forEach((fn) => fn());
}

/* ======================= LIGHT PLATFORM ROUTES ======================= */
export function initPlatformEffects(root = document) {
  const page = root.querySelector(".platform-page");
  if (!page) return () => {};

  const cleanups = [];
  const reduce = reducedMotion();
  page.classList.add("platform-motion-ready");

  const items = [...page.querySelectorAll(
    ".platform-process-step, .platform-fit-list article, .platform-services-list article, .platform-work-item, .platform-faq-list details, .migration-flow span, .platform-hub-link",
  )];
  items.forEach((item, index) => {
    item.classList.add("platform-motion-item");
    item.style.setProperty("--motion-order", String(index % 4));
  });

  if (reduce) {
    items.forEach((item) => item.classList.add("is-inview"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-inview");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    items.forEach((item) => observer.observe(item));
    cleanups.push(() => observer.disconnect());

    page.querySelectorAll(".platform-primary, .platform-secondary, .platform-submit").forEach((button) => {
      const onMove = rafThrottle((event) => {
        const rect = button.getBoundingClientRect();
        button.style.setProperty("--button-x", `${event.clientX - rect.left}px`);
        button.style.setProperty("--button-y", `${event.clientY - rect.top}px`);
      });
      button.addEventListener("pointermove", onMove);
      cleanups.push(() => button.removeEventListener("pointermove", onMove));
    });
  }

  return () => {
    cleanups.forEach((cleanup) => cleanup());
    items.forEach((item) => {
      item.classList.remove("platform-motion-item", "is-inview");
      item.style.removeProperty("--motion-order");
    });
    page.classList.remove("platform-motion-ready");
  };
}
