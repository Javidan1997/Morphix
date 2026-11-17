// Aurel: drop countdown, variant matching, live engraving preview.
import { formatMoney } from "cfg-core";

const GOLD = {
  Yellow: ["#f1d79b", "#c79a4f", "#f4dfaa"],
  White: ["#f2f2f0", "#b9bbbd", "#f7f7f5"],
  Rose: ["#f3c7b3", "#c98468", "#f6d3c2"],
};
// Characters an engraver can cut; everything else is dropped as you type.
const ALLOWED = /[^A-Za-z0-9 ·&♡+.,'\-]/g;

function goLive() {
  document.querySelectorAll("[data-au-product]").forEach((s) => (s.dataset.live = "true"));
  document.querySelectorAll("[data-buy]").forEach((el) => (el.hidden = false));
  document.querySelectorAll("[data-waitlist]").forEach((el) => (el.hidden = true));
  document.querySelectorAll("[data-drop-cta]").forEach((a) => (a.textContent = a.dataset.liveText));
}

class Countdown extends HTMLElement {
  connectedCallback() {
    this.target = Date.parse(this.dataset.target);
    this.parts = { d: this.querySelector("[data-d]"), h: this.querySelector("[data-h]"), m: this.querySelector("[data-m]"), s: this.querySelector("[data-s]") };
    this.tick();
    this.timer = setInterval(() => this.tick(), 1000);
  }
  disconnectedCallback() {
    clearInterval(this.timer);
  }
  tick() {
    const left = Math.max(0, this.target - Date.now());
    const pad = (n) => String(n).padStart(2, "0");
    this.parts.d.textContent = pad(Math.floor(left / 864e5));
    this.parts.h.textContent = pad(Math.floor(left / 36e5) % 24);
    this.parts.m.textContent = pad(Math.floor(left / 6e4) % 60);
    this.parts.s.textContent = pad(Math.floor(left / 1e3) % 60);
    if (left === 0) {
      clearInterval(this.timer);
      this.querySelector(".au-countdown__label").textContent = this.dataset.liveLabel;
      this.classList.add("is-live");
      goLive();
    }
  }
}
customElements.define("au-countdown", Countdown);

for (const section of document.querySelectorAll("[data-au-product]")) {
  const root = section.querySelector("[data-aurel-form]");
  const form = root.querySelector("form");
  const product = JSON.parse(root.querySelector("script[data-cfg-product]").textContent);
  const input = form.querySelector("[data-engrave]");
  const out = section.querySelector("[data-engrave-out]");
  const count = form.querySelector("[data-engrave-count]");
  const max = Number(input.maxLength);

  const selected = () => [form.querySelector('[data-option="1"]:checked').value, form.querySelector('[data-option="2"]').value];

  function syncVariant() {
    const [metal, size] = selected();
    const v = product.variants.find((x) => x.option1 === metal && x.option2 === size);
    if (!v) return;
    form.querySelector("[data-variant-input]").value = v.id;
    section.querySelector("[data-price]").textContent = formatMoney(v.price);
    section.querySelector("[data-metal-label]").textContent = metal;
    section.querySelectorAll("[data-metal-image]").forEach((el) => el.classList.toggle("is-active", el.dataset.metalImage === metal));
    const g = GOLD[metal.split(" ")[0]] || GOLD.Yellow;
    ["data-g0", "data-g1", "data-g2"].forEach((a, i) => section.querySelector(`[${a}]`)?.setAttribute("stop-color", g[i]));
  }

  function syncEngraving() {
    const clean = input.value.replace(ALLOWED, "").slice(0, max);
    if (clean !== input.value) input.value = clean;
    out.textContent = clean || "Your words here";
    out.closest("text").classList.toggle("is-placeholder", !clean);
    count.textContent = `${clean.length} / ${max}`;
    count.classList.toggle("is-full", clean.length >= max);
    const style = form.querySelector("[data-engrave-style]:checked").value.toLowerCase();
    out.closest("text").dataset.style = style;
  }

  form.addEventListener("change", (e) => (e.target.matches("[data-option]") ? syncVariant() : syncEngraving()));
  input.addEventListener("input", syncEngraving);
  syncVariant();
  syncEngraving();
}
