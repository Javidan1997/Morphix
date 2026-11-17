// Linkcore fixture: four products whose specs and compatibility rules are
// metafields — the same fields shopify/scripts/linkcore_import.py writes.
import { img, mf, product } from "./helpers.mjs";

const P = (handle, title, price, asset, meta, compat, extra = {}) =>
  product({
    handle,
    title,
    variants: [{ price, sku: meta.sku }],
    featured_image: img(`linkcore-${asset}`, 1200, 1200, title, [480, 800, 1200]),
    metafields: {
      custom: {
        tagline: mf(meta.tagline),
        highlights: mf(meta.highlights, "list.single_line_text_field"),
        host_interface: mf(meta.host_interface),
        max_displays: mf(meta.max_displays),
        max_resolution: mf(meta.max_resolution),
        power_delivery_w: mf(meta.power_delivery_w, "number_integer"),
        ethernet: mf(meta.ethernet),
        usb_a: mf(meta.usb_a, "number_integer"),
        usb_c: mf(meta.usb_c),
        sd_card: mf(meta.sd_card, "boolean"),
        driver: mf(meta.driver),
        warranty: mf(meta.warranty),
        compatibility: mf(compat, "json"),
        ...(meta.badge ? { badge: mf(meta.badge) } : {}),
      },
    },
    ...extra,
  });

const products = {
  "dock-12": P("dock-12", "Linkcore Dock 12", 28900, "dock12",
    { sku: "LC-D12-TB4", badge: "Flagship", tagline: "Thunderbolt 4 dock for two 4K screens.", highlights: ["Thunderbolt 4", "2 × 4K60", "96 W", "2.5 GbE"], host_interface: "Thunderbolt 4 / USB4", max_displays: "2", max_resolution: "2 × 4K 60 Hz", power_delivery_w: 96, ethernet: "2.5 GbE", usb_a: 4, usb_c: "3 (2 × TB4)", sd_card: true, driver: false, warranty: "3 years" },
    { hosts: { tb4: { displays: 2, res: "4K60" }, usb4: { displays: 2, res: "4K60" }, usbc_dp: { displays: 1, res: "4K30", res1: "4K30" } }, mst: false, displaylink: false, pd_w: 96, ethernet: "2.5 GbE" }),
  "dock-8": P("dock-8", "Linkcore Dock 8", 15900, "dock8",
    { sku: "LC-D8-USBC", tagline: "USB-C dock with dual HDMI for Windows desks.", highlights: ["USB-C", "2 × HDMI", "85 W", "1 GbE"], host_interface: "USB-C (DP Alt Mode)", max_displays: "2 (Windows, MST)", max_resolution: "4K 60 Hz / 2 × 4K 30 Hz", power_delivery_w: 85, ethernet: "1 GbE", usb_a: 3, usb_c: "1", sd_card: false, driver: false, warranty: "2 years" },
    { hosts: { tb4: { displays: 2, res: "4K30", res1: "4K60" }, usb4: { displays: 2, res: "4K30", res1: "4K60" }, usbc_dp: { displays: 2, res: "4K30", res1: "4K60" } }, mst: true, displaylink: false, pd_w: 85, ethernet: "1 GbE" }),
  "hub-7": P("hub-7", "Linkcore Hub 7", 5900, "hub7",
    { sku: "LC-H7", tagline: "Pocket hub for one screen and the basics.", highlights: ["USB-C", "HDMI 4K", "85 W pass-through"], host_interface: "USB-C (DP Alt Mode)", max_displays: "1", max_resolution: "4K 30 Hz", power_delivery_w: 85, ethernet: false, usb_a: 2, usb_c: false, sd_card: true, driver: false, warranty: "2 years" },
    { hosts: { tb4: { displays: 1, res: "4K30" }, usb4: { displays: 1, res: "4K30" }, usbc_dp: { displays: 1, res: "4K30" } }, mst: false, displaylink: false, pd_w: 85, ethernet: null }),
  "duallink-dl": P("duallink-dl", "Linkcore DualLink DL", 19900, "dl2",
    { sku: "LC-DL2", badge: "Mac multi-display", tagline: "Two screens on any laptop, even base MacBooks.", highlights: ["DisplayLink", "2 × 4K30", "65 W", "1 GbE"], host_interface: "USB-C or USB-A", max_displays: "2 (any laptop)", max_resolution: "2 × 4K 30 Hz", power_delivery_w: 65, ethernet: "1 GbE", usb_a: 1, usb_c: "1", sd_card: false, driver: "DisplayLink (free)", warranty: "3 years" },
    { hosts: { tb4: { displays: 2, res: "4K30" }, usb4: { displays: 2, res: "4K30" }, usbc_dp: { displays: 2, res: "4K30" }, usbc_nodp: { displays: 2, res: "4K30" } }, mst: false, displaylink: true, pd_w: 65, ethernet: "1 GbE" }),
};

const lineup = { handle: "docks-hubs", title: "Docks & hubs", products: Object.values(products), products_count: 4 };

export default { template: "collection.linkcore", context: { collection: lineup }, products, collections: { "docks-hubs": lineup } };
