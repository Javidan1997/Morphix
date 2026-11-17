// Shadeline configurator: live price from metafield rules, band-variant
// matching, line-item properties, add-on lines, poster swap and a lazily
// loaded 3D viewer: Configuro's production pergola engine. three.js is
// ~190 KB gzipped, so it only loads after scroll or when the buyer asks for 3D.
import { formatMoney } from "cfg-core";
import { quote, DEFAULT_RULES } from "./shadeline-pricing.js";

const root = document.querySelector("[data-shadeline]");
if (root) init(root);

function init(root) {
  const section = root.closest(".sl-config");
  const form = root.querySelector("form");
  const product = JSON.parse(section.querySelector("script[data-cfg-product]:not([data-addon])").textContent);
  const rules = JSON.parse(section.querySelector("script[data-price-rules]").textContent) || DEFAULT_RULES;
  const addons = Object.fromEntries(
    [...section.querySelectorAll("script[data-addon]")].map((s) => {
      const p = JSON.parse(s.textContent);
      return [s.dataset.addon, p.variants[0]];
    }),
  );
  const ADDON_HANDLE = { lighting: "led-lighting", screens: "zip-screen", install: "installation" };
  const $ = (sel) => section.querySelector(sel);
  const state = { width: 420, depth: 340, finish: "Anthracite", lighting: false, screens: 0, install: true };
  let viewer = null;
  let lastQuote = null;

  // Exact size → price + matching band variant.
  function update(source) {
    lastQuote = quote(state, rules);
    const q = lastQuote;
    const variant = product.variants.find((v) => v.option1 === `${q.band.width} cm` && v.option2 === `${q.band.depth} cm` && v.option3 === state.finish);
    if (variant) $("[data-variant-input]").value = variant.id;
    $("[data-dims]").textContent = `${(q.width / 100).toFixed(2)} × ${(q.depth / 100).toFixed(2)} m`;
    $("[data-band]").textContent = `Made in ${q.band.width / 100} × ${q.band.depth / 100} m frame`;
    $("[data-prop-band]").value = `${q.band.width} × ${q.band.depth} cm, cut to ${q.width} × ${q.depth} cm`;
    $("[data-total]").textContent = formatMoney(q.total);
    const lines = [`<li><span>Frame, ${state.finish} · ${q.band.width / 100} × ${q.band.depth / 100} m band</span><span>${formatMoney(q.frame)}</span></li>`];
    for (const a of q.addons) lines.push(`<li><span>${a.label} · ${a.quantity} ${a.unit}</span><span>${formatMoney(a.price)}</span></li>`);
    $("[data-lines]").innerHTML = lines.join("");
    for (const [key, rule] of Object.entries(rules.addons)) {
      const el = section.querySelector(`[data-addon-price="${key}"]`);
      if (el) el.textContent = `${formatMoney(rule.perUnit)} per ${rule.unit}`;
    }
    section.querySelectorAll("[data-poster]").forEach((p) => p.classList.toggle("is-active", p.dataset.poster === state.finish));
    if (viewer) viewer.update(state, source);
  }

  // Range and number inputs stay in sync; numbers are clamped on change.
  for (const dim of ["width", "depth"]) {
    const range = section.querySelector(`[data-dim="${dim}"]`);
    const num = section.querySelector(`[data-dim-number="${dim}"]`);
    const fill = () => range.style.setProperty("--fill", `${((range.value - range.min) / (range.max - range.min)) * 100}%`);
    fill();
    range.addEventListener("input", fill);
    num.addEventListener("change", () => requestAnimationFrame(fill));
    range.addEventListener("input", () => {
      num.value = range.value;
      state[dim] = Number(range.value);
      update("size");
    });
    num.addEventListener("change", () => {
      const v = Math.round(Math.min(Number(num.max), Math.max(Number(num.min), Number(num.value) || state[dim])) / 10) * 10;
      num.value = range.value = v;
      state[dim] = v;
      update("size");
    });
  }
  section.querySelectorAll("[data-finish]").forEach((r) =>
    r.addEventListener("change", () => {
      state.finish = r.value;
      update("finish");
    }),
  );
  section.querySelectorAll("[data-addon-toggle]").forEach((el) =>
    el.addEventListener("change", () => {
      const key = el.dataset.addonToggle;
      state[key] = el.type === "checkbox" ? el.checked : Number(el.value);
      update(key);
    }),
  );

  // Extra cart lines for add-ons, linked to the pergola by a config id.
  root.addEventListener("cfg:collect", (event) => {
    const configId = `SL-${Date.now().toString(36).toUpperCase()}`;
    const [main] = event.detail.items;
    main.properties._config_id = configId;
    for (const a of lastQuote.addons) {
      const variant = addons[ADDON_HANDLE[a.key]];
      if (!variant) continue;
      event.detail.items.push({ id: variant.id, quantity: a.quantity, properties: { For: `Pergola ${lastQuote.width} × ${lastQuote.depth} cm`, _parent: configId } });
    }
  });

  // ------------------------------------------------------------ 3D viewer
  const stage = $("[data-stage]");
  const loadBtn = $("[data-load-3d]");
  let loading = null;
  function load3D() {
    if (loading) return loading;
    loadBtn.setAttribute("aria-busy", "true");
    // Configuro's production pergola engine (bundled in shadeline-viewer.js).
    loading = import("./shadeline-viewer.js")
      .then(({ mountViewer }) => {
        viewer = mountViewer($("[data-viewer]"), state, {
          onStatus: (status) => {
            if (status === "ready") {
              stage.classList.add("is-3d");
              loadBtn.hidden = true;
              $("[data-viewer-hint]").hidden = false;
            } else if (status === "error") {
              loadBtn.hidden = true;
            }
          },
        });
      })
      .catch((error) => {
        console.warn("3D viewer unavailable, keeping posters", error);
        loadBtn.hidden = true;
      });
    return loading;
  }
  loadBtn.addEventListener("click", load3D);
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        (window.requestIdleCallback || setTimeout)(load3D);
      }
    });
    // Start watching only after the buyer scrolls: three.js never competes
    // with first paint, even when the stage is already on screen.
    window.addEventListener("scroll", () => io.observe(stage), { once: true, passive: true });
  }
  form.addEventListener("pointerdown", () => load3D(), { once: true });

  update("init");
}
