// Northgate quick-order grid + demo trade login.
import { cart, formatMoney, openCart, isDemo } from "cfg-core";

/** Price per case for a quantity: the highest tier whose `min` is reached. */
export function tierPrice(tiers, qty) {
  let price = tiers[0].price;
  for (const t of tiers) if (qty >= t.min) price = t.price;
  return price;
}

class QuickOrder extends HTMLElement {
  connectedCallback() {
    this.rows = [...this.querySelectorAll("[data-row]")];
    this.addEventListener("input", (e) => {
      if (e.target.matches("[data-cases]")) this.recalc();
      if (e.target.matches("[data-filter]")) this.filter(e.target.value);
    });
    this.querySelector("[data-add-all]").addEventListener("click", () => this.addAll());
    this.querySelector("[data-load-last]")?.addEventListener("click", () => this.loadLast());
    this.recalc();
  }
  lines() {
    return this.rows
      .map((row) => {
        const qty = Math.max(0, Math.floor(Number(row.querySelector("[data-cases]").value) || 0));
        const tiers = JSON.parse(row.dataset.tiers);
        return { row, id: row.dataset.variant, qty, unit: tierPrice(tiers, qty || 1), tiers };
      })
      .filter(Boolean);
  }
  recalc() {
    let cases = 0, total = 0, count = 0;
    for (const l of this.lines()) {
      l.row.querySelector("[data-unit]").textContent = formatMoney(l.unit);
      l.row.querySelector("[data-line]").textContent = l.qty ? formatMoney(l.unit * l.qty) : "—";
      l.row.classList.toggle("is-active", l.qty > 0);
      // Hint at the next tier, e.g. "+4 cases → $22.40".
      const next = l.tiers.find((t) => t.min > Math.max(l.qty, 0));
      l.row.querySelector("[data-unit]").title = next ? `${next.min - l.qty} more for ${formatMoney(next.price)}/case` : "Best tier";
      if (l.qty) {
        cases += l.qty;
        total += l.unit * l.qty;
        count += 1;
      }
    }
    this.querySelector("[data-sum-lines]").textContent = count;
    this.querySelector("[data-sum-cases]").textContent = cases;
    this.querySelector("[data-sum-total]").textContent = formatMoney(total);
    const btn = this.querySelector("[data-add-all]");
    btn.disabled = count === 0;
    btn.textContent = count ? `Add ${count} line${count > 1 ? "s" : ""} to cart` : "Add to cart";
  }
  filter(q) {
    const term = q.trim().toLowerCase();
    for (const row of this.rows) row.hidden = term && !row.dataset.search.includes(term);
  }
  loadLast() {
    const last = JSON.parse(this.querySelector("[data-last-order]").textContent);
    for (const row of this.rows) row.querySelector("[data-cases]").value = last[row.dataset.variant] || 0;
    this.recalc();
  }
  async addAll() {
    const items = this.lines()
      .filter((l) => l.qty > 0)
      .map((l) => ({
        id: l.id,
        quantity: l.qty,
        // Informational only: the tier discount Function recomputes the price
        // at checkout from the same metafield. The demo cart uses it to show
        // the trade price.
        properties: { _tier_price: String(l.unit) },
      }));
    const btn = this.querySelector("[data-add-all]");
    btn.setAttribute("aria-busy", "true");
    try {
      await cart.add(items);
      openCart();
    } catch (error) {
      const err = this.querySelector("[data-form-error]");
      err.textContent = error.message;
      err.hidden = false;
    } finally {
      btn.removeAttribute("aria-busy");
    }
  }
}
if (!customElements.get("ng-quick-order")) customElements.define("ng-quick-order", QuickOrder);

// ------------------------------------------------------------------ demo login
// The build renders the trade view of the pricing and quick-order sections with
// the same Liquid (customer tagged trade-approved) into <template> tags. Signing
// in swaps them in; no request is made.
if (isDemo && !window.__ngDemo) {
  window.__ngDemo = true;
  const dialog = document.getElementById("TradeLogin");
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-trade-login], .cfg-header__account");
    if (!link || !dialog) return;
    e.preventDefault();
    if (document.documentElement.dataset.trade === "1") return;
    dialog.showModal();
  });
  document.getElementById("TradeLoginForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    for (const tpl of document.querySelectorAll('template[data-demo-state="trade"]')) {
      const current = document.querySelector(`[id="shopify-section-${tpl.dataset.section}"]`);
      if (current) current.replaceWith(tpl.content.cloneNode(true));
    }
    document.documentElement.dataset.trade = "1";
    document.querySelectorAll(".cfg-header__account").forEach((a) => {
      a.textContent = "Acme Hospitality";
      a.setAttribute("aria-label", "Signed in as Acme Hospitality (demo)");
    });
    dialog.close();
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  });
}
