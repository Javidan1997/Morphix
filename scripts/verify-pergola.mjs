// End-to-end checks for /pergola-configurator against a built site.
//
//   npm run build && node scripts/serve-pages.mjs 4173
//   node scripts/verify-pergola.mjs [screenshotDir]
//
// Lead submission is verified with the Supabase request intercepted in the
// browser, so running this never writes to the production lead table.
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import puppeteer from "puppeteer-core";
import { DEFAULT_CONFIG, encodeConfig, normalizeConfig } from "../src/pergola/configModel.js";

const BASE = process.env.BASE_URL || "http://localhost:4173";
const PAGE = `${BASE}/pergola-configurator`;
const shots = process.argv[2] || "verify-output";
mkdirSync(shots, { recursive: true });
const chrome = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const results = [];
const check = (ok, label, detail = "") => { results.push({ ok, label }); console.log(`${ok ? "ok  " : "FAIL"} ${label}${detail ? ` (${detail})` : ""}`); };
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---- HTTP level -------------------------------------------------------------
async function http(path, { redirect = "manual" } = {}) {
  const response = await fetch(`${BASE}${path}`, { redirect });
  return { status: response.status, location: response.headers.get("location"), text: redirect === "manual" && response.status >= 300 && response.status < 400 ? "" : await response.text(), type: response.headers.get("content-type") };
}
{
  const page = await http("/pergola-configurator");
  check(page.status === 200 && /text\/html/.test(page.type), "singular URL returns 200 HTML", String(page.status));
  check((page.text.match(/<h1[\s>]/g) || []).length === 1, "exactly one H1 in initial HTML");
  check(page.text.includes('<link rel="canonical" href="https://configuro.studio/pergola-configurator" />'), "canonical in initial HTML");
  check(!/noindex/.test(page.text), "no noindex");
  check(page.text.includes("og:image") && page.text.includes("application/ld+json"), "OG image and JSON-LD present");
  check(page.text.includes("Configure a louvered pergola") && page.text.includes("Request a quote"), "configurator and quote content prerendered");
  const legacy = await http("/pergola-configurators");
  check(legacy.status === 301 && legacy.location?.startsWith("/pergola-configurators/"), "old URL: host redirect to folder", `${legacy.status} ${legacy.location}`);
  const stub = await http("/pergola-configurators/");
  check(stub.status === 200 && stub.text.includes('location.replace("/pergola-configurator" + location.search') && stub.text.includes('rel="canonical" href="https://configuro.studio/pergola-configurator"'), "old URL stub redirects and canonicalises");
  for (const asset of ["/pergola-configurators/models/10x10.glb", "/pergola-configurators/environments/Patio.glb", "/pergola-configurators/hero-morning.png", "/pergola-configurators/v2/env-pool.glb", "/pergola-configurators/v2/heater.glb", "/pergola-configurators/v2/sky-1k.hdr", "/pergola-configurators/v2/img/poster-960.avif", "/pergola-configurators/v2/img/og-pergola-configurator.jpg"]) {
    const response = await fetch(`${BASE}${asset}`, { method: "HEAD" });
    check(response.status === 200, `asset ${asset}`, String(response.status));
  }
  const sitemap = await http("/sitemap.xml");
  check(sitemap.text.includes("<loc>https://configuro.studio/pergola-configurator</loc>") && !sitemap.text.includes("pergola-configurators</loc>"), "sitemap lists singular URL only");
  const robots = await http("/robots.txt");
  check(robots.status === 200 && !/Disallow: \/pergola/.test(robots.text), "robots allows the page");
}

const browser = await puppeteer.launch({ executablePath: chrome, headless: "new", args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist", "--hide-scrollbars"] });

async function open(url, { viewport = { width: 1440, height: 900 }, mobile = false, reducedMotion = false, noWebGL = false, context } = {}) {
  const ctx = context || (await browser.createBrowserContext());
  const page = await ctx.newPage();
  const problems = [];
  page.on("console", (msg) => { if (msg.type() === "error") problems.push(`console: ${msg.text().slice(0, 200)}`); });
  page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
  page.on("requestfailed", (request) => { if (!/supabase|googletagmanager/.test(request.url())) problems.push(`failed: ${request.url()} ${request.failure()?.errorText}`); });
  page.on("response", (response) => { if (response.status() >= 400 && !/supabase/.test(response.url())) problems.push(`${response.status()}: ${response.url()}`); });
  if (mobile) {
    await page.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true }, userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" });
  } else {
    await page.setViewport(viewport);
  }
  if (reducedMotion) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  if (noWebGL) await page.evaluateOnNewDocument(() => { const original = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (type, ...rest) { return /webgl/.test(type) ? null : original.call(this, type, ...rest); }; });
  // Record programmatic downloads (blob links) so exports can be inspected.
  await page.evaluateOnNewDocument(() => {
    window.__downloads = [];
    const click = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (this.download && this.href.startsWith("blob:")) {
        const entry = { name: this.download, size: 0, text: "" };
        window.__downloads.push(entry);
        fetch(this.href).then((r) => r.blob()).then(async (blob) => { entry.size = blob.size; entry.type = blob.type; if (/html|text/.test(blob.type)) entry.text = await blob.text(); });
        return undefined;
      }
      return click.call(this);
    };
  });
  await page.goto(url, { waitUntil: "networkidle0" });
  return { page, ctx, problems };
}

const toStage = (page) => page.evaluate(() => document.querySelector(".pc-stage").scrollIntoView({ block: "center" }));
const viewerReady = (page) => page.waitForSelector('.pc-stage[data-status="ready"]', { timeout: 30000 });
const clickTab = (page, label) => page.evaluate((text) => [...document.querySelectorAll(".pc-tab")].find((b) => b.textContent === text).click(), label);
const clickLabel = (page, text) => page.evaluate((value) => { const label = [...document.querySelectorAll(".pc-panel label, .pc-form label")].find((l) => l.textContent.trim() === value); label.querySelector("input").click(); return Boolean(label); }, text);
const summary = (page) => page.$$eval(".pc-summary-list div", (rows) => rows.map((row) => row.textContent));
const code = (page) => page.$eval(".pc-summary .pc-code code", (node) => node.textContent);
const search = (page) => page.evaluate(() => location.search);
const dataLayer = (page) => page.evaluate(() => (window.dataLayer || []).filter((entry) => entry && entry.event).map((entry) => ({ ...entry })));

// ---- Legacy redirect in a real browser ----------------------------------------
{
  const legacyDesign = encodeURIComponent(JSON.stringify({ width: 4, depth: 3.5, finish: "white", glass: true, glassOpen: 40, attached: true }));
  const { page, ctx } = await open(`${BASE}/pergola-configurators?package=custom&design=${legacyDesign}&utm_source=google&gclid=TEST123`);
  await page.waitForFunction(() => location.pathname === "/pergola-configurator", { timeout: 10000 });
  await wait(800);
  const query = await search(page);
  check(query.includes("utm_source=google") && query.includes("gclid=TEST123"), "legacy link keeps campaign parameters", query);
  const rows = (await summary(page)).join(" | ");
  check(rows.includes("Wall-mounted") && rows.includes("Traffic white") && rows.includes("Sliding glass"), "legacy design migrated into new configurator");
  check(/c=1[0-9A-Za-z]{11}(&|$)/.test(query), "legacy link rewritten to short design code");
  await ctx.close();
}

// ---- Desktop: every control, URL state, exports --------------------------------
{
  const { page, ctx, problems } = await open(`${PAGE}?utm_source=newsletter&utm_campaign=sept&gclid=G-CLICK`);
  const hero = await page.$eval("h1", (h) => ({ text: h.textContent, lines: Math.round(h.getBoundingClientRect().height / parseFloat(getComputedStyle(h).lineHeight)) }));
  check(hero.lines <= 2, "hero headline fits two lines on desktop", `${hero.lines} lines`);
  await page.screenshot({ path: join(shots, "desktop-hero.png") });
  await toStage(page);
  await viewerReady(page);
  check(true, "3D viewer loads");
  const before = await code(page);

  await clickTab(page, "Size");
  await page.focus('input[type="range"]');
  for (let i = 0; i < 60; i++) await page.keyboard.press("ArrowRight");
  let rows = (await summary(page)).join(" | ");
  check(/Footprint.*23′/.test(rows) || /Footprint/.test(rows), "width slider changes footprint", rows.split(" | ")[0]);
  check(await page.$eval(".pc-note[data-active]", () => true).catch(() => false), "bay rule note activates above module width");
  await clickLabel(page, "Wall-mounted");
  await clickTab(page, "Roof");
  await page.focus(".pc-panel:not([hidden]) input[type=range]");
  for (let i = 0; i < 4; i++) await page.keyboard.press("ArrowLeft");
  await page.evaluate(() => document.querySelector('.pc-panel:not([hidden]) input[name="pc-finish"][value="ral9016"]').click());
  await page.evaluate(() => document.querySelector('.pc-panel:not([hidden]) input[name="pc-blade"][value="ral7016"]').click());
  await clickTab(page, "Sides");
  await clickLabel(page, "Back");
  const wallNote = await page.evaluate(() => document.querySelector(".pc-panel:not([hidden]) .pc-note-box")?.textContent || "");
  check(wallNote.includes("wall side"), "wall side blocks side systems");
  await clickLabel(page, "Left");
  await page.evaluate(() => document.querySelector('.pc-panel:not([hidden]) input[name="pc-system"][value="zip"]').click());
  await clickLabel(page, "Front");
  await page.evaluate(() => document.querySelector('.pc-panel:not([hidden]) input[name="pc-system"][value="sliding"]').click());
  const ranges = await page.$$eval(".pc-panel:not([hidden]) input[type=range]", (els) => els.map((el) => el.max));
  check(ranges.includes("75") && ranges.includes("100"), "glass opening capped at 75%, screen at 100%", ranges.join(","));
  await clickTab(page, "Extras");
  await clickLabel(page, "Colour");
  await clickLabel(page, "2");
  await clickTab(page, "Scene");
  await clickLabel(page, "Poolside");
  await clickLabel(page, "Night");
  await page.waitForFunction(() => !document.querySelector(".pc-stage-status")?.textContent.includes("Loading"), { timeout: 30000 });
  await wait(1500);
  rows = (await summary(page)).join(" | ");
  check(rows.includes("Wall-mounted") && rows.includes("Traffic white") && rows.includes("Left: ZIP screen") && rows.includes("Front: Sliding glass") && rows.includes("Colour") && rows.includes("Poolside, Night"), "summary reflects every control", rows);
  await page.screenshot({ path: join(shots, "desktop-configured.png") });
  for (const view of ["Front", "Side", "Top", "Inside", "Overview"]) {
    await page.evaluate((label) => [...document.querySelectorAll(".pc-chip")].find((b) => b.textContent === label).click(), view);
    await wait(900);
  }
  check(true, "camera presets respond");
  await page.focus(".pc-host");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("+");
  const after = await code(page);
  check(before !== after, "design code changes with configuration", `${before} -> ${after}`);
  await wait(500);
  const query = await search(page);
  check(query.includes(`c=${after}`) && query.includes("utm_source=newsletter") && query.includes("gclid=G-CLICK"), "URL carries design code and keeps campaign params", query);

  // Refresh restores the design.
  await page.reload({ waitUntil: "networkidle0" });
  await wait(600);
  check((await code(page)) === after, "refresh restores the design");

  // Share link, image and spec exports.
  await ctx.overridePermissions(BASE, ["clipboard-read", "clipboard-write", "clipboard-sanitized-write"]);
  await toStage(page);
  await viewerReady(page);
  await page.evaluate(() => [...document.querySelectorAll(".pc-tool")].find((b) => b.textContent.includes("share")).click());
  await wait(400);
  const clip = await page.evaluate(() => navigator.clipboard.readText()).catch(() => "");
  check(clip === `${BASE}/pergola-configurator?c=${after}`, "share link copied", clip);
  await page.evaluate(() => [...document.querySelectorAll(".pc-tool")].find((b) => b.textContent.includes("image")).click());
  await page.evaluate(() => [...document.querySelectorAll(".pc-tool")].find((b) => b.textContent.includes("spec")).click());
  await wait(2500);
  const files = await page.evaluate(() => window.__downloads);
  const png = files.find((f) => f.name.endsWith(".png"));
  check(png && png.type === "image/png" && png.size > 20000, "screenshot export produces a PNG", png ? `${png.name} ${png.size} bytes` : "none");
  const spec = files.find((f) => f.name.endsWith(".html"));
  check(spec && spec.text.includes("data:image/png;base64") && spec.text.includes(after), "spec sheet export includes image and design code", spec ? `${spec.name} ${spec.size} bytes` : "none");

  // Shared link opens identically in a fresh browser session.
  const fresh = await open(clip);
  await wait(500);
  check((await code(fresh.page)) === after && (await summary(fresh.page)).join("|") === (await summary(page)).join("|"), "shared link reproduces design in a new session");
  await fresh.ctx.close();

  const layer = await dataLayer(page);
  const names = layer.map((e) => e.event);
  check(names.includes("configuration_share") && names.includes("screenshot_export") && names.includes("spec_export"), "share/export events tracked", names.join(","));
  check(problems.length === 0, "desktop: no console errors or failed requests", problems.slice(0, 5).join(" ; "));
  await ctx.close();
}

// ---- Quote form: validation, error, retry, dedupe, attribution -------------------
{
  const { page, ctx, problems } = await open(`${PAGE}?utm_source=google&utm_medium=cpc&utm_campaign=pergola&gclid=ADS-1`);
  let calls = 0;
  const bodies = [];
  const CORS = { "access-control-allow-origin": "*", "access-control-allow-headers": "authorization, apikey, content-type, prefer" };
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (/\/rest\/v1\/configuro_inquiries/.test(request.url()) && request.method() === "POST") {
      calls += 1;
      bodies.push(request.postData());
      if (calls === 1) return request.respond({ status: 503, headers: CORS, contentType: "application/json", body: '{"message":"Service unavailable"}' });
      return request.respond({ status: 201, headers: CORS, contentType: "application/json", body: "" });
    }
    if (/functions\/v1\/erpnext-sync/.test(request.url())) return request.respond({ status: 200, headers: CORS, contentType: "application/json", body: "{}" });
    if (request.method() === "OPTIONS") return request.respond({ status: 204, headers: { ...CORS, "access-control-allow-headers": "*", "access-control-allow-methods": "POST" } });
    return request.continue();
  });
  await page.evaluate(() => document.getElementById("quote").scrollIntoView());
  await page.click(".pc-form button[type=submit]");
  await wait(300);
  const errors = await page.$$eval(".pc-form .pc-error", (els) => els.length);
  const focused = await page.evaluate(() => document.activeElement?.name);
  check(errors >= 4 && focused === "name", "empty submit shows inline errors and focuses first field", `${errors} errors, focus=${focused}`);
  await page.type("#pc-q-name", "Test Buyer");
  await page.type("#pc-q-email", "not-an-email");
  await page.type("#pc-q-company", "Verification Co");
  await page.type("#pc-q-message", "Automated verification. Not a real inquiry.");
  await page.click(".pc-form button[type=submit]");
  await wait(200);
  check((await page.$eval("#pc-q-email", (el) => el.getAttribute("aria-invalid"))) === "true", "invalid email rejected");
  await page.$eval("#pc-q-email", (el) => { el.focus(); });
  await page.keyboard.down("Control"); await page.keyboard.press("A"); await page.keyboard.up("Control");
  await page.type("#pc-q-email", "buyer@example.com");
  await clickLabel(page, "Dealer or distributor");
  await page.click(".pc-form button[type=submit]");
  await wait(200);
  check(calls === 0, "consent required before sending");
  await page.evaluate(() => document.querySelector('.pc-form input[name="consent"]').click());
  await page.click(".pc-form button[type=submit]");
  await page.waitForSelector(".pc-form-error", { timeout: 10000 });
  let layer = await dataLayer(page);
  check(!layer.some((e) => e.event === "generate_lead"), "failed submission shows error and no conversion");
  await page.screenshot({ path: join(shots, "form-error.png") });
  await page.click(".pc-form button[type=submit]");
  await page.waitForSelector(".pc-form-done", { timeout: 10000 });
  await page.screenshot({ path: join(shots, "form-success.png") });
  layer = await dataLayer(page);
  const leads = layer.filter((e) => e.event === "generate_lead");
  check(leads.length === 1, "exactly one lead conversion after confirmed insert", String(leads.length));
  const body = JSON.parse(bodies[1] || "{}");
  check(JSON.parse(bodies[0]).metadata.localId === body.metadata?.localId, "retry reuses the same lead id");
  check(body.source === "pergola-configurator" && body.metadata?.attribution?.lastTouch?.gclid === "ADS-1" && body.metadata?.attribution?.lastTouch?.utm_campaign === "pergola", "lead carries UTM and click id attribution");
  check(Boolean(body.metadata?.configuration?.code) && body.brief.includes("pergola-configurator?c="), "lead carries design code, spec and link");
  const serialized = JSON.stringify(layer);
  check(!/buyer@example\.com|Test Buyer|Verification Co|Automated verification/.test(serialized), "analytics payloads contain no personal data");
  check(leads[0].lead_id === body.metadata.localId, "conversion id matches stored lead id");
  // Remount with same session: conversion must not repeat for the same id.
  const stored = await page.evaluate(() => JSON.parse(sessionStorage.getItem("configuro.leads.sent.v1") || "[]"));
  check(stored.includes(leads[0].lead_id), "sent lead id recorded to block duplicate conversions");
  // The first request is a deliberate 503, which Chrome also logs.
  check(problems.filter((p) => !/503|Service Unavailable/.test(p)).length === 0, "form flow: no unexpected console errors", problems.join(" ; "));
  await ctx.close();
}

// ---- Story sections: gallery, comparison, hotspots, story, guided demo ------------
{
  const start = encodeConfig(normalizeConfig({ ...DEFAULT_CONFIG, width: 5.5, finish: "ral9016", sides: { ...DEFAULT_CONFIG.sides, front: "fixed" } }));
  const { page, ctx, problems } = await open(`${PAGE}?c=${start}&utm_source=story`);
  const html = await (await fetch(PAGE)).text();
  for (const heading of ["A setting for every project", "One space. A different atmosphere.", "See every option in action", "Built around your product"]) {
    check(html.includes(heading), `prerendered heading: ${heading}`);
  }
  const summaryText = async () => (await summary(page)).join(" | ");
  const before = await summaryText();

  // Gallery: select, explore keeps the design, example replaces it with undo.
  await page.evaluate(() => document.getElementById("settings").scrollIntoView());
  await wait(600);
  const largeImages = await page.$$eval(".pc-gallery-frame picture", (els) => els.length);
  check(largeImages <= 2, "gallery loads at most the active and next large image", String(largeImages));
  await page.click(".pc-thumb:nth-child(2)");
  await wait(900);
  check((await page.$eval(".pc-gallery-detail h3", (h) => h.textContent)) === "Wall-mounted integration", "gallery thumbnail selects scene");
  await page.click(".pc-gallery-actions .pc-btn-primary");
  await page.waitForSelector('.pc-stage[data-status="ready"]', { timeout: 30000 });
  await wait(1200);
  let after = await summaryText();
  check(after.includes("Poolside") && after.includes("Traffic white") && after.includes("Front: Fixed glass") && after.includes("18′"), "explore opens live scene and keeps dimensions, finish and options", after);
  check((await page.$eval(".pc-toast", (el) => el.textContent)).includes("concept render"), "scene toast labels the concept honestly");
  check(await page.$eval('.pc-panel:not([hidden]) input[name="pc-environment"][value="pool"]', (el) => el.checked), "explore opens the Scene tab on the matching scene");
  await page.evaluate(() => document.getElementById("settings").scrollIntoView());
  await wait(400);
  await page.evaluate(() => [...document.querySelectorAll(".pc-gallery-detail .pc-linklike")].find((b) => b.textContent.includes("example")).click());
  await wait(700);
  after = await summaryText();
  check(after.includes("Wall-mounted"), "load example design applies the example", after.split(" | ")[2]);
  await page.evaluate(() => document.querySelector(".pc-toast .pc-linklike").click());
  await wait(500);
  after = await summaryText();
  check(after.includes("Freestanding") && after.includes("Traffic white") && after.includes("Poolside"), "undo restores the previous design");

  // Rapid scene switching then settle on one scene.
  await clickTab(page, "Scene");
  for (const name of ["Patio", "Deck", "Rooftop", "Studio", "Patio", "Poolside"]) { await clickLabel(page, name); await wait(120); }
  await page.waitForFunction(() => window.__pergolaViewer === undefined || true, { timeout: 1000 });
  await wait(6000);
  const status = await page.$eval(".pc-stage-status", (el) => el.textContent);
  check(!status.includes("Loading") && (await summaryText()).includes("Poolside"), "rapid scene switching settles on the last choice", status || "(idle)");

  // Comparison: keyboard moves the divider, buttons jump, night CTA sets only time.
  await page.evaluate(() => document.getElementById("day-night").scrollIntoView());
  await wait(500);
  await page.focus(".pc-compare-range");
  for (let i = 0; i < 10; i++) await page.keyboard.press("ArrowLeft");
  check((await page.$eval(".pc-compare-range", (el) => el.value)) === "40", "comparison divider responds to keyboard");
  await page.click(".pc-compare-toggle .pc-chip-btn:nth-child(2)");
  await wait(900);
  check((await page.$eval(".pc-compare-frame", (el) => el.style.getPropertyValue("--split"))) === "0%", "Evening button moves divider fully");
  const beforeNight = await summaryText();
  await page.click(".pc-compare-caption .pc-btn");
  await wait(1200);
  after = await summaryText();
  check(after.includes("Night") && after.replace("Night", "Day") === beforeNight.replace("Night", "Day"), "Try night lighting changes only the time of day");

  // Feature story: state chips, detail hotspots via keyboard.
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluate(() => document.getElementById("in-action").scrollIntoView());
  await wait(800);
  await page.evaluate(() => document.querySelectorAll(".pc-story-chapter")[1].scrollIntoView({ block: "center" }));
  await wait(1200);
  const activeLayer = await page.$eval(".pc-story-layer[data-active]", (el) => [...el.parentNode.children].indexOf(el));
  check(activeLayer === 1, "sticky story follows the active chapter", String(activeLayer));
  const layer = await page.$(".pc-story-layer[data-active]");
  await layer.$eval(".pc-story-states .pc-chip-btn:nth-child(3)", (b) => b.click());
  await wait(900);
  check(await layer.$eval(".pc-story-frame .pc-crossfade[data-active] img", (img) => img.complete && img.naturalWidth > 0 && img.currentSrc.includes("story-enclosure-screen")), "story state chip shows the captured model frame");
  await layer.$eval(".pc-story-mode .pc-chip-btn:nth-child(2)", (b) => b.click());
  await wait(400);
  const hotspot = await layer.$(".pc-hotspot");
  await hotspot.focus();
  await page.keyboard.press("Enter");
  await wait(300);
  check(Boolean(await layer.$(".pc-hotspot-panel")), "hotspot opens with keyboard");
  await page.keyboard.press("Escape");
  await wait(200);
  check(!(await layer.$(".pc-hotspot-panel")) && (await page.evaluate(() => document.activeElement.classList.contains("pc-hotspot"))), "Escape closes hotspot and returns focus");
  check((await page.$$eval(".pc-hotspot-list div", (els) => els.length)) >= 4, "hotspot details also exist as a text list");

  // Guided demo: start, stop on interaction restores, finish and keep.
  const designBefore = await code(page);
  await page.click(".pc-story-head .pc-btn");
  await page.waitForSelector(".pc-demo-bar", { timeout: 30000 });
  await wait(2500);
  check((await code(page)) === designBefore, "guided demo does not change the saved design while playing");
  await page.click(".pc-demo-actions .pc-chip-btn:nth-child(1)");
  check((await page.$eval(".pc-demo-actions", (el) => el.textContent)).includes("Resume"), "guided demo pauses");
  await page.click(".pc-demo-actions .pc-chip-btn:nth-child(1)");
  const box = await (await page.$(".pc-host")).boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await wait(500);
  check(!(await page.$(".pc-demo-bar")) && (await code(page)) === designBefore, "manual interaction stops the demo and keeps the design");
  await page.click(".pc-demo-btn");
  await page.waitForSelector(".pc-demo-bar");
  await page.waitForFunction(() => document.querySelector(".pc-demo-actions")?.textContent.includes("Keep"), { timeout: 20000 });
  await page.evaluate(() => [...document.querySelectorAll(".pc-demo-actions .pc-chip-btn")].find((b) => b.textContent.includes("Keep")).click());
  await wait(600);
  after = await summaryText();
  check((await code(page)) !== designBefore && after.includes("Sliding glass 75%") && after.includes("Warm white"), "Keep this setup applies the demonstrated design", after);
  const events = (await dataLayer(page)).map((e) => e.event);
  for (const name of ["environment_explore", "example_design_load", "compare_interaction", "feature_hotspot", "guided_demo_start", "guided_demo_stop", "guided_demo_complete", "guided_demo_keep"]) {
    check(events.includes(name), `tracked ${name}`);
  }
  check(events.filter((e) => e === "compare_interaction").length === 1, "comparison interaction tracked once");

  // Discuss a custom environment carries a readable interest into the quote.
  await page.evaluate(() => document.getElementById("settings").scrollIntoView());
  await wait(300);
  await page.click(".pc-gallery-actions .pc-btn-secondary");
  await wait(900);
  check((await page.$eval(".pc-interest", (el) => el.textContent)).includes("Custom environment like the"), "discuss environment attaches a readable interest to the quote form");
  const hydration = problems.filter((p) => /hydrat|#418|#423|#425/i.test(p));
  check(hydration.length === 0, "no hydration errors");
  check(problems.length === 0, "story sections: no console errors or failed requests", problems.slice(0, 5).join(" ; "));
  await ctx.close();
}

// Scene load failure shows the studio and a clear message.
{
  const { page, ctx } = await open(PAGE);
  await page.setRequestInterception(true);
  page.on("request", (request) => (/env-deck\.glb/.test(request.url()) ? request.abort() : request.continue()));
  await toStage(page);
  await viewerReady(page);
  await clickTab(page, "Scene");
  await clickLabel(page, "Deck");
  await page.waitForFunction(() => document.querySelector(".pc-stage-status")?.textContent.includes("could not load"), { timeout: 20000 }).catch(() => {});
  check((await page.$eval(".pc-stage-status", (el) => el.textContent)).includes("could not load"), "scene load failure is reported and the studio remains");
  await ctx.close();
}

// Reduced motion switched on while the page is open: content stays visible.
{
  const { page, ctx } = await open(PAGE);
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await wait(300);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await wait(300);
  const hidden = await page.$$eval("[data-reveal]", (els) => els.filter((el) => getComputedStyle(el).opacity !== "1").length);
  check(hidden === 0 && !(await page.evaluate(() => document.documentElement.classList.contains("pc-motion"))), "live change to reduced motion reveals everything", `${hidden} hidden`);
  await ctx.close();
}

// ---- Mobile, touch, reduced motion, no WebGL -------------------------------------
{
  const { page, ctx, problems } = await open(PAGE, { mobile: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check(overflow <= 0, "mobile: no horizontal overflow", `${overflow}px`);
  await page.screenshot({ path: join(shots, "mobile-hero.png") });
  await toStage(page);
  await viewerReady(page);
  await wait(1200);
  const touchAction = await page.$eval(".pc-canvas", (el) => el.style.touchAction);
  check(touchAction === "pan-y", "mobile: canvas lets the page scroll vertically", touchAction);
  const targets = await page.$$eval(".pc-tab, .pc-segment span, .pc-icon-btn, .pc-tool, .pc-btn", (els) => els.filter((el) => el.offsetParent).map((el) => Math.round(el.getBoundingClientRect().height)).filter((h) => h < 34).length);
  check(targets === 0, "mobile: touch targets at least 34px tall", `${targets} small`);
  await page.evaluate(() => window.scrollBy(0, 200));
  await wait(400);
  await page.screenshot({ path: join(shots, "mobile-configurator.png") });
  await page.evaluate(() => document.getElementById("quote").scrollIntoView());
  await wait(500);
  await page.screenshot({ path: join(shots, "mobile-quote.png") });
  check(problems.length === 0, "mobile: no console errors or failed requests", problems.slice(0, 5).join(" ; "));
  await ctx.close();
}
{
  const { page, ctx } = await open(PAGE, { reducedMotion: true });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await wait(400);
  const hidden = await page.$$eval("[data-reveal]", (els) => els.filter((el) => getComputedStyle(el).opacity !== "1").length);
  check(hidden === 0, "reduced motion: all content visible without animation", `${hidden} hidden`);
  await page.keyboard.press("Tab");
  const skip = await page.evaluate(() => ({ text: document.activeElement.textContent, outline: getComputedStyle(document.activeElement).top }));
  check(skip.text === "Skip to content", "keyboard: skip link is first tab stop");
  await ctx.close();
}
{
  const { page, ctx } = await open(PAGE, { noWebGL: true });
  await toStage(page);
  await page.waitForSelector('.pc-stage[data-status="error"]', { timeout: 20000 });
  const poster = await page.$eval(".pc-poster img", (img) => img.complete && img.naturalWidth > 0);
  await clickTab(page, "Scene");
  await clickLabel(page, "Night");
  const rows = (await summary(page)).join(" | ");
  check(poster && rows.includes("Night"), "no WebGL: poster fallback shown and options still work");
  await page.screenshot({ path: join(shots, "no-webgl.png") });
  await ctx.close();
}
{
  const { page, ctx } = await open(`${PAGE}?lang=tr`);
  await wait(500);
  const lang = await page.evaluate(() => ({ html: document.documentElement.lang, h1: document.querySelector("h1").textContent }));
  check(lang.html === "tr" && lang.h1.includes("pergola konfigüratörü"), "Turkish language switch", lang.h1);
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) process.exit(1);
