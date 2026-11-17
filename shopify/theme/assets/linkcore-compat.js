// Linkcore compatibility rules — pure, no DOM, unit-tested in Node
// (scripts/templates/test-linkcore-compat.mjs).
//
// Product side: metafield custom.compatibility (JSON)
//   { hosts: { tb4: { displays: 2, res: "4K60" }, usb4: {...}, usbc_dp: {...}, usbc_nodp: {...} },
//     mst: true, displaylink: false, pd_w: 96, ethernet: "2.5 GbE" | null }
// Computer side: checker section blocks (profile)
//   { port: "usb4", max_external: 1, mst: false, charger_w: 70 }

const PORT_NAMES = {
  tb4: "Thunderbolt 4",
  usb4: "USB4 / Thunderbolt",
  usbc_dp: "USB-C with DisplayPort Alt Mode",
  usbc_nodp: "USB-C without video output",
};
const RES_RANK = { "1080p": 1, "1440p": 2, "4K": 3 };

/**
 * @param {object} profile  computer profile
 * @param {object} needs    { monitors, resolution: "1080p"|"1440p"|"4K", ethernet, charge }
 * @param {object} compat   product compatibility metafield
 * @returns {{ status: "ok"|"limited"|"no", displays: number, notes: string[], info: string[] }}
 */
export function evaluate(profile, needs, compat) {
  const notes = [];
  const info = [];
  const host = compat.hosts?.[profile.port];
  if (!host) return { status: "no", displays: 0, notes: [`Doesn't work over ${PORT_NAMES[profile.port] || profile.port}.`], info };
  let displays = host.displays;
  let status = "ok";
  if (compat.displaylink) {
    // DisplayLink compresses video over USB, so the host's native display
    // limit and MST support don't apply.
    info.push("Uses DisplayLink: install the free driver once. Great for office work, not for gaming.");
  } else {
    if (displays > profile.max_external) {
      displays = profile.max_external;
      if (needs.monitors > displays)
        notes.push(profile.max_external === 0 ? "Your computer can't send video over this port." : `Your computer supports ${profile.max_external} external display${profile.max_external > 1 ? "s" : ""} natively.`);
    }
    if (displays > 1 && compat.mst && !profile.mst) {
      displays = 1;
      if (needs.monitors > 1) notes.push("macOS and ChromeOS don't support MST, so a second screen would only mirror the first.");
    }
  }
  if (needs.monitors > displays) {
    if (displays === 0) return { status: "no", displays, notes: notes.length ? notes : ["No video output for your setup."], info };
    status = "limited";
    notes.unshift(`Drives ${displays} of your ${needs.monitors} monitors.`);
  }
  // Many docks run one screen at 4K60 but two at 4K30 (res1 = single-screen mode).
  const res = needs.monitors <= 1 && host.res1 ? host.res1 : host.res;
  if (needs.monitors > 0 && needs.resolution === "4K" && res === "4K30") {
    status = "limited";
    notes.push("4K runs at 30 Hz: sharp for documents, choppy for video and scrolling.");
  }
  if (RES_RANK[needs.resolution] > RES_RANK[host.max || "4K"]) {
    status = "limited";
    notes.push(`Tops out at ${host.max} on this port.`);
  }
  if (needs.ethernet && !compat.ethernet) {
    status = "limited";
    notes.push("No Ethernet port.");
  }
  if (needs.charge && compat.pd_w < profile.charger_w) {
    status = "limited";
    notes.push(`Charges at ${compat.pd_w} W; your laptop's charger is ${profile.charger_w} W, so it charges slower under load.`);
  }
  return { status, displays, notes, info };
}

const ORDER = { ok: 0, limited: 1, no: 2 };
/** Rank products: works > limited > no; then fewer caveats; then cheaper. */
export function rank(results) {
  return [...results].sort((a, b) => ORDER[a.result.status] - ORDER[b.result.status] || a.result.notes.length - b.result.notes.length || a.price - b.price);
}
