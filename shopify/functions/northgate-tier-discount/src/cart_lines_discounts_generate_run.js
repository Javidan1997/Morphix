// Prices each trade line at its quantity tier by discounting the difference
// between the list price and the tier price (tiers are cents per case).

/** Same rule as the theme (assets/northgate.js → tierPrice). */
export function tierPrice(tiers, qty) {
  let price = tiers[0].price;
  for (const t of tiers) if (qty >= t.min) price = t.price;
  return price;
}

export function cartLinesDiscountsGenerateRun(input) {
  const empty = { operations: [] };
  if (!input.discount.discountClasses.includes("PRODUCT")) return empty;
  if (!input.cart.buyerIdentity?.customer?.hasAnyTag) return empty;

  const candidates = [];
  for (const line of input.cart.lines) {
    const tiers = line.merchandise?.product?.tiers?.jsonValue;
    if (!Array.isArray(tiers) || !tiers.length) continue;
    const listPrice = Number(line.cost.amountPerQuantity.amount);
    const target = tierPrice(tiers, line.quantity) / 100;
    const off = Math.round((listPrice - target) * 100) / 100;
    if (off <= 0) continue;
    const tier = [...tiers].reverse().find((t) => line.quantity >= t.min);
    candidates.push({
      message: `Trade price · ${tier.min}+ cases`,
      targets: [{ cartLine: { id: line.id } }],
      value: { fixedAmount: { amount: off.toFixed(2), appliesToEachItem: true } },
    });
  }
  return candidates.length ? { operations: [{ productDiscountsAdd: { candidates, selectionStrategy: "ALL" } }] } : empty;
}
