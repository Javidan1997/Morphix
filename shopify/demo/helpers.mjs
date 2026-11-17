// Builders that shape fixture data like Shopify's Liquid objects (and like
// `{{ product | json }}`), so sections render identically in the demo build
// and on a real store.

/** Image object backed by generated theme assets: <src>-<w>.webp. */
export function img(src, width, height, alt, sizes = [480, 800, 1200, 1600]) {
  return { src, width, height, alt, aspect_ratio: +(width / height).toFixed(4), sizes: sizes.filter((w) => w <= width), ext: "webp" };
}

/** Wrap plain values the way metafields appear in Liquid: { value, type }. */
export function mf(value, type = "single_line_text_field") {
  return { value, type };
}

let nextId = 46000000000;
export function product({ handle, title, variants, options = ["Title"], selling_plan_groups = [], selectedIndex = 0, ...rest }) {
  const vs = variants.map((v, i) => {
    const id = v.id ?? nextId++;
    const opts = [v.option1, v.option2, v.option3].filter((o) => o != null);
    return {
      id,
      title: v.title ?? (opts.join(" / ") || "Default Title"),
      option1: v.option1 ?? null,
      option2: v.option2 ?? null,
      option3: v.option3 ?? null,
      options: opts,
      sku: v.sku ?? `${handle.toUpperCase()}-${i + 1}`,
      price: v.price,
      compare_at_price: v.compare_at_price ?? null,
      available: v.available ?? true,
      featured_image: v.featured_image ?? null,
      selling_plan_allocations: v.selling_plan_allocations ?? [],
      metafields: v.metafields ?? {},
      position: i + 1,
    };
  });
  const prices = vs.map((v) => v.price);
  const options_with_values = options.map((name, i) => ({
    name,
    position: i + 1,
    values: [...new Set(vs.map((v) => v.options[i]).filter(Boolean))],
  }));
  const p = {
    id: nextId++,
    handle,
    title,
    url: `/products/${handle}`,
    available: vs.some((v) => v.available),
    price: Math.min(...prices),
    price_min: Math.min(...prices),
    price_max: Math.max(...prices),
    price_varies: new Set(prices).size > 1,
    compare_at_price: vs[0].compare_at_price,
    options,
    options_with_values,
    variants: vs,
    has_only_default_variant: vs.length === 1 && options[0] === "Title",
    selling_plan_groups,
    requires_selling_plan: false,
    selected_or_first_available_variant: vs[selectedIndex],
    tags: [],
    metafields: {},
    ...rest,
  };
  p.featured_image = rest.featured_image ?? vs[0].featured_image ?? null;
  p.images = rest.images ?? [p.featured_image].filter(Boolean);
  return p;
}

/** Selling-plan allocation for a variant price and a percentage discount. */
export function allocation(plan, groupId, price, percent) {
  const discounted = Math.round(price * (1 - percent / 100));
  return {
    selling_plan_id: plan.id,
    selling_plan_group_id: groupId,
    selling_plan: plan,
    price: discounted,
    compare_at_price: price,
    per_delivery_price: discounted,
  };
}
