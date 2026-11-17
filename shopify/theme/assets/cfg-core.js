// Configuro Concepts — shared storefront runtime (no dependencies, no jQuery).
//
// Loaded as an ES module by layout/theme.liquid on a real Shopify store AND by
// the public demos on configuro.studio/templates. The only difference is the
// cart adapter:
//   live store → Shopify Ajax Cart API (/cart/add.js, /cart.js, /cart/change.js)
//   demo mode  → an in-memory cart built from the product JSON on the page.
// In demo mode nothing leaves the browser and nothing is persisted: forms show
// their success state locally and checkout is disabled.

const CFG = window.CFG || { demo: false, moneyFormat: "${{amount}}", routes: { cartAdd: "/cart/add", cart: "/cart", cartChange: "/cart/change" } };
export const isDemo = Boolean(CFG.demo);

// ------------------------------------------------------------------ helpers
export function formatMoney(cents, format = CFG.moneyFormat) {
  const value = Number(cents || 0) / 100;
  const withDecimals = value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const noDecimals = value.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return String(format || "${{amount}}")
    .replace(/{{\s*amount_no_decimals\s*}}/, noDecimals)
    .replace(/{{\s*amount\s*}}/, withDecimals);
}

export const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export function emit(name, detail) {
  document.dispatchEvent(new CustomEvent(name, { detail }));
}

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ------------------------------------------------------- product registry
// Every product section prints {{ product | json }} into
// <script type="application/json" data-cfg-product>. The demo cart uses it to
// price lines exactly like Shopify would (variant price, or the selling plan
// allocation price when a subscription is chosen).
const variantIndex = new Map();
function indexProducts() {
  document.querySelectorAll("script[data-cfg-product]").forEach((node) => {
    if (node.dataset.indexed) return;
    node.dataset.indexed = "1";
    try {
      const product = JSON.parse(node.textContent);
      for (const variant of product.variants || []) variantIndex.set(String(variant.id), { product, variant });
    } catch (error) {
      console.warn("cfg: bad product JSON", error);
    }
  });
}

function imageSrc(image) {
  if (!image) return "";
  if (typeof image === "string") return image;
  if (image.url) return image.url;
  const base = CFG.assetBase || "";
  const size = (image.sizes || [image.width]).find((w) => w >= 160) || image.width;
  return `${base}${image.src}-${size}.${image.ext || "webp"}`;
}

// ------------------------------------------------------------ cart adapters
const liveCart = {
  async get() {
    const res = await fetch(`${CFG.routes.cart}.js`, { headers: { Accept: "application/json" } });
    return res.json();
  },
  async add(items) {
    const res = await fetch(`${CFG.routes.cartAdd}.js`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ items }),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.description || body.message || "Could not add to cart");
    return this.get();
  },
  async change(key, quantity) {
    const res = await fetch(`${CFG.routes.cartChange}.js`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ id: key, quantity }),
    });
    return res.json();
  },
};

const demoState = { items: [] };
function demoSnapshot() {
  const items = demoState.items.map((line) => ({ ...line, final_line_price: line.final_price * line.quantity }));
  return {
    items,
    item_count: items.reduce((n, l) => n + l.quantity, 0),
    total_price: items.reduce((n, l) => n + l.final_line_price, 0),
    currency: "USD",
  };
}
const demoCart = {
  async get() {
    return demoSnapshot();
  },
  async add(items) {
    indexProducts();
    for (const item of items) {
      const found = variantIndex.get(String(item.id));
      if (!found) throw new Error(`Unknown variant ${item.id}`);
      const { product, variant } = found;
      let price = variant.price;
      let selling_plan_allocation = null;
      if (item.selling_plan) {
        const alloc = (variant.selling_plan_allocations || []).find((a) => String(a.selling_plan_id) === String(item.selling_plan));
        const plan = (product.selling_plan_groups || []).flatMap((g) => g.selling_plans).find((p) => String(p.id) === String(item.selling_plan));
        if (alloc) {
          price = alloc.price;
          selling_plan_allocation = { price: alloc.price, selling_plan: { id: plan?.id, name: plan?.name } };
        }
      }
      const properties = Object.fromEntries(Object.entries(item.properties || {}).filter(([, v]) => v !== "" && v != null));
      // B2B tiers: on a live store the tier discount Function prices the line
      // at checkout; the demo mirrors that with the informational _tier_price.
      if (properties._tier_price) price = Number(properties._tier_price);
      const key = `${variant.id}:${item.selling_plan || ""}:${JSON.stringify(properties)}`;
      const existing = demoState.items.find((l) => l.key === key);
      if (existing) existing.quantity += Number(item.quantity || 1);
      else
        demoState.items.push({
          key,
          id: variant.id,
          product_title: product.title,
          variant_title: variant.title === "Default Title" ? null : variant.title,
          quantity: Number(item.quantity || 1),
          final_price: price,
          original_price: variant.compare_at_price || variant.price,
          image: imageSrc(variant.featured_image || product.featured_image),
          properties,
          selling_plan_allocation,
        });
    }
    return demoSnapshot();
  },
  async change(key, quantity) {
    const line = demoState.items.find((l) => l.key === key);
    if (line) line.quantity = quantity;
    demoState.items = demoState.items.filter((l) => l.quantity > 0);
    return demoSnapshot();
  },
};

export const cart = {
  adapter: isDemo ? demoCart : liveCart,
  async get() {
    return this.adapter.get();
  },
  async add(items) {
    const state = await this.adapter.add(items);
    emit("cfg:cart", state);
    return state;
  },
  async change(key, quantity) {
    const state = await this.adapter.change(key, quantity);
    emit("cfg:cart", state);
    return state;
  },
};

// ------------------------------------------------------------- cart drawer
class CartDrawer extends HTMLElement {
  connectedCallback() {
    this.dialog = this.querySelector("dialog");
    this.lines = this.querySelector("[data-cart-lines]");
    this.footer = this.querySelector("[data-cart-footer]");
    this.dialog.addEventListener("click", (event) => {
      if (event.target === this.dialog || event.target.closest("[data-close]")) this.close();
    });
    this.lines.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-line-qty]");
      if (!btn) return;
      cart.change(btn.dataset.key, Math.max(0, Number(btn.dataset.lineQty)));
    });
    this.querySelector("[data-demo-checkout]")?.addEventListener("click", () => {
      this.querySelector("[data-demo-checkout-msg]").hidden = false;
    });
    document.addEventListener("cfg:cart", (event) => this.render(event.detail));
    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-open-cart]")) this.open();
    });
  }
  open() {
    if (!this.dialog.open) this.dialog.showModal();
    document.documentElement.classList.add("cfg-lock");
  }
  close() {
    this.dialog.close();
    document.documentElement.classList.remove("cfg-lock");
  }
  render(state) {
    document.querySelectorAll("[data-cart-count]").forEach((el) => (el.textContent = `(${state.item_count})`));
    document.querySelectorAll("[data-cart-count-badge]").forEach((el) => {
      el.textContent = state.item_count;
      el.hidden = state.item_count === 0;
    });
    this.footer.hidden = state.item_count === 0;
    this.querySelector("[data-cart-total]").textContent = formatMoney(state.total_price);
    const ship = this.querySelector("[data-cart-shipping]");
    if (CFG.freeShipping > 0 && state.item_count > 0) {
      const left = CFG.freeShipping - state.total_price;
      ship.hidden = false;
      ship.querySelector("[data-cart-shipping-text]").textContent =
        left > 0 ? `You're ${formatMoney(left)} away from free shipping.` : "You've unlocked free shipping.";
      ship.querySelector("[data-cart-shipping-bar]").style.transform = `scaleX(${Math.min(1, state.total_price / CFG.freeShipping)})`;
    } else ship.hidden = true;

    if (!state.items.length) {
      this.lines.innerHTML = `<p class="cfg-cart__empty">Your cart is empty.</p>`;
      return;
    }
    this.lines.innerHTML = `<ul class="cfg-cart__lines">${state.items
      .map((line) => {
        const props = Object.entries(line.properties || {})
          .filter(([k]) => !k.startsWith("_"))
          .map(([k, v]) => `<li><span>${escapeHtml(k)}:</span> ${escapeHtml(v)}</li>`)
          .join("");
        const plan = line.selling_plan_allocation ? `<li class="cfg-cart__plan">${escapeHtml(line.selling_plan_allocation.selling_plan.name)}</li>` : "";
        const title = escapeHtml(line.product_title);
        return `<li class="cfg-cart__line">
          ${line.image ? `<img src="${escapeHtml(line.image)}" alt="" width="72" height="72" loading="lazy">` : `<span class="cfg-cart__ph"></span>`}
          <div class="cfg-cart__info">
            <p class="cfg-cart__title">${title}</p>
            ${line.variant_title ? `<p class="cfg-cart__variant">${escapeHtml(line.variant_title)}</p>` : ""}
            ${props || plan ? `<ul class="cfg-cart__props">${plan}${props}</ul>` : ""}
            <div class="cfg-cart__qty" role="group" aria-label="Quantity for ${title}">
              <button type="button" data-line-qty="${line.quantity - 1}" data-key="${escapeHtml(line.key)}" aria-label="Decrease quantity">−</button>
              <span aria-live="polite">${line.quantity}</span>
              <button type="button" data-line-qty="${line.quantity + 1}" data-key="${escapeHtml(line.key)}" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <p class="cfg-cart__price">${formatMoney(line.final_line_price)}</p>
        </li>`;
      })
      .join("")}</ul>`;
  }
}
customElements.define("cfg-cart-drawer", CartDrawer);

export function openCart() {
  document.querySelector("cfg-cart-drawer")?.open();
}

// ------------------------------------------------------------ product form
// <cfg-product-form> wraps {% form 'product' %}. Brand scripts may listen for
// "cfg:collect" to append extra line items (e.g. pergola add-ons).
class ProductForm extends HTMLElement {
  connectedCallback() {
    this.form = this.querySelector("form");
    this.error = this.querySelector("[data-form-error]");
    this.form.addEventListener("submit", (event) => this.onSubmit(event));
  }
  collect() {
    const data = new FormData(this.form);
    const properties = {};
    for (const [key, value] of data.entries()) {
      const m = key.match(/^properties\[(.+)\]$/);
      if (m && value !== "") properties[m[1]] = value;
    }
    const main = { id: data.get("id"), quantity: Number(data.get("quantity") || 1), properties };
    if (data.get("selling_plan")) main.selling_plan = data.get("selling_plan");
    const items = [main];
    this.dispatchEvent(new CustomEvent("cfg:collect", { detail: { items, form: this.form }, bubbles: true }));
    return items;
  }
  async onSubmit(event) {
    event.preventDefault();
    if (!this.form.reportValidity()) return;
    const buttons = document.querySelectorAll(`[form="${this.form.id}"][type="submit"], #${CSS.escape(this.form.id)} [type="submit"]`);
    buttons.forEach((b) => b.setAttribute("aria-busy", "true"));
    if (this.error) this.error.hidden = true;
    try {
      await cart.add(this.collect());
      openCart();
    } catch (error) {
      if (this.error) {
        this.error.textContent = error.message;
        this.error.hidden = false;
      }
    } finally {
      buttons.forEach((b) => b.removeAttribute("aria-busy"));
    }
  }
}
customElements.define("cfg-product-form", ProductForm);

// --------------------------------------------------------------- dialogs
// <button data-dialog-open="SizeGuide"> opens <dialog id="SizeGuide">.
document.addEventListener("click", (event) => {
  const opener = event.target.closest("[data-dialog-open]");
  if (opener) {
    const dialog = document.getElementById(opener.dataset.dialogOpen);
    if (dialog && !dialog.open) {
      dialog.showModal();
      document.documentElement.classList.add("cfg-lock");
    }
    return;
  }
  const dialog = event.target.closest("dialog.cfg-drawer, dialog.cfg-modal");
  if (dialog && dialog.id !== "CartDrawer" && (event.target === dialog || event.target.closest("[data-close]"))) {
    dialog.close();
  }
});
document.addEventListener("close", (event) => {
  if (event.target.matches?.("dialog")) document.documentElement.classList.remove("cfg-lock");
}, true);

// ----------------------------------------------------------------- forms
// Customer / contact forms. Live store: Shopify posts the form and redirects
// back with ?customer_posted=true, which flips the success state. Demo: the
// submit is cancelled, the form is validated and cleared, nothing is sent.
function showFormSuccess(form) {
  const wrap = form.closest("[data-cfg-form]");
  if (!wrap) return;
  wrap.dataset.state = "success";
  const msg = wrap.querySelector("[data-form-success]");
  if (msg) {
    msg.hidden = false;
    msg.setAttribute("tabindex", "-1");
    msg.focus({ preventScroll: true });
  }
  emit("cfg:form-success", { form, wrap });
}

document.addEventListener(
  "submit",
  (event) => {
    const form = event.target;
    const type = form.querySelector('input[name="form_type"]')?.value;
    if (!isDemo || form.closest("cfg-product-form") || form.hasAttribute("data-cfg-custom")) return;
    if (!["customer", "contact", "create_customer", "customer_login"].includes(type) && !form.hasAttribute("data-cfg-demo")) return;
    event.preventDefault();
    if (!form.reportValidity()) return;
    form.reset();
    showFormSuccess(form);
  },
  true,
);

if (/[?&](customer_posted|contact_posted)=true/.test(location.search)) {
  const form = document.querySelector("[data-cfg-form] form");
  if (form) showFormSuccess(form);
}

// ------------------------------------------------------------ quantities
document.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-qty-step]");
  if (!btn) return;
  const input = btn.closest("[data-qty]")?.querySelector("input");
  if (!input) return;
  const min = Number(input.min || 0);
  const max = input.max ? Number(input.max) : Infinity;
  const step = Number(input.step || 1);
  input.value = Math.min(max, Math.max(min, Number(input.value || 0) + Number(btn.dataset.qtyStep) * step));
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
});

// ------------------------------------------------------------ reveal-on-scroll
if ("IntersectionObserver" in window && !prefersReducedMotion()) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
} else {
  document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));
}

indexProducts();
if (!isDemo) cart.get().then((state) => emit("cfg:cart", state)).catch(() => {});
