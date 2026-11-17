// Vela buy box: live bundle + subscription pricing, image swap, sticky bar.
// Progressive enhancement over a form that already works without JS.
import { formatMoney } from "cfg-core";

for (const root of document.querySelectorAll("[data-vela-buy]")) {
  const product = JSON.parse(root.querySelector("script[data-cfg-product]").textContent);
  const form = root.querySelector("form");
  const section = root.closest(".shopify-section") || document;
  const planSelect = form.querySelector("[data-plan-select]");
  const sticky = section.querySelector("[data-sticky]");
  const prices = section.querySelectorAll("[data-price]");

  const selectedVariant = () => {
    const id = form.querySelector('input[name="id"]:checked')?.value;
    return product.variants.find((v) => String(v.id) === String(id));
  };
  const subscribing = () => form.querySelector('input[name="purchase_type"]:checked')?.value === "subscribe";

  function priceFor(variant) {
    if (!subscribing() || !planSelect) return variant.price;
    const alloc = (variant.selling_plan_allocations || []).find((a) => String(a.selling_plan_id) === planSelect.value);
    return alloc ? alloc.price : variant.price;
  }

  function update() {
    const variant = selectedVariant();
    if (!variant) return;
    form.querySelectorAll(".vela-pack").forEach((label) => label.classList.toggle("is-checked", label.querySelector("input").checked));
    form.querySelectorAll(".vela-option").forEach((opt) => opt.classList.toggle("is-checked", opt.querySelector('input[type="radio"]').checked));
    if (planSelect) planSelect.disabled = !subscribing();
    const price = formatMoney(priceFor(variant));
    prices.forEach((el) => (el.textContent = price));
    section.querySelectorAll("[data-variant-image]").forEach((frame) => frame.classList.toggle("is-active", frame.dataset.variantImage === String(variant.id)));
    const meta = section.querySelector("[data-sticky-meta]");
    if (meta) meta.textContent = `${variant.title}${subscribing() ? ` · ${planSelect.selectedOptions[0].textContent.trim()}` : " · One-time"}`;
  }

  form.addEventListener("change", update);
  update();

  // Sticky bar: visible once the in-page button has scrolled out of view.
  if (sticky) {
    const cta = form.querySelector("[data-atc]");
    let ctaVisible = true;
    let pastHero = false;
    const sync = () => {
      const show = !ctaVisible && pastHero;
      sticky.classList.toggle("is-visible", show);
      sticky.setAttribute("aria-hidden", String(!show));
      sticky.inert = !show;
    };
    new IntersectionObserver(([e]) => {
      ctaVisible = e.isIntersecting;
      sync();
    }).observe(cta);
    const hero = document.querySelector(".vela-hero");
    if (hero)
      new IntersectionObserver(([e]) => {
        pastHero = !e.isIntersecting;
        sync();
      }).observe(hero);
    else pastHero = true;
  }
}
