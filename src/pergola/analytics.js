// Analytics, ad attribution and consent for /pergola-configurator.
//
// - Events always go to window.dataLayer (cheap, no network). Google tags load
//   only after the visitor accepts, and only if an ID is configured:
//     VITE_GTM_ID                 GTM-XXXXXXX  (preferred: manage tags in GTM)
//     VITE_GA4_ID                 G-XXXXXXXXXX
//     VITE_GOOGLE_ADS_ID          AW-XXXXXXXXX
//     VITE_GOOGLE_ADS_LEAD_LABEL  conversion label for the lead action
// - Payloads never contain names, emails, phone numbers or free text.
// - Campaign parameters and ad click IDs are captured on landing and attached
//   to the lead record so a conversion can be attributed server-side too.

const env = import.meta.env || {};
const IDS = {
  gtm: env.VITE_GTM_ID || "",
  ga4: env.VITE_GA4_ID || "",
  ads: env.VITE_GOOGLE_ADS_ID || "",
  adsLeadLabel: env.VITE_GOOGLE_ADS_LEAD_LABEL || "",
};
export const trackingConfigured = Boolean(IDS.gtm || IDS.ga4 || IDS.ads);

const CONSENT_KEY = "configuro.consent.v1";
const ATTRIBUTION_KEY = "configuro.attribution.v1";
const LEADS_KEY = "configuro.leads.sent.v1";
const ATTRIBUTION_TTL = 90 * 24 * 3600 * 1000;
export const CAMPAIGN_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id"];
export const CLICK_IDS = ["gclid", "gbraid", "wbraid", "dclid", "msclkid", "fbclid", "li_fat_id", "ttclid"];

const storage = (kind) => {
  try { return window[kind]; } catch { return null; }
};
const readJson = (kind, key) => {
  try { return JSON.parse(storage(kind)?.getItem(key) || "null"); } catch { return null; }
};
const writeJson = (kind, key, value) => {
  try { storage(kind)?.setItem(key, JSON.stringify(value)); } catch { /* storage blocked */ }
};

// ---- Consent -----------------------------------------------------------------
export function getConsent() {
  return readJson("localStorage", CONSENT_KEY)?.choice || "unset";
}

function gtag() {
  window.dataLayer = window.dataLayer || [];
  // gtag.js reads the arguments object, not an array.
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

let tagsLoaded = false;
function loadScript(src) {
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function loadTags() {
  if (tagsLoaded || !trackingConfigured) return;
  tagsLoaded = true;
  if (IDS.gtm) {
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    loadScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(IDS.gtm)}`);
  }
  const gtagId = IDS.ga4 || IDS.ads;
  if (gtagId) {
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gtagId)}`);
    gtag("js", new Date());
    if (IDS.ga4) gtag("config", IDS.ga4, { send_page_view: true });
    if (IDS.ads) gtag("config", IDS.ads);
  }
}

export function initAnalytics() {
  window.dataLayer = window.dataLayer || [];
  gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied", wait_for_update: 500 });
  captureAttribution();
  if (getConsent() === "granted") grantConsent({ persist: false });
}

export function grantConsent({ persist = true } = {}) {
  if (persist) writeJson("localStorage", CONSENT_KEY, { choice: "granted", at: new Date().toISOString() });
  gtag("consent", "update", { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "denied", analytics_storage: "granted" });
  // Persist attribution only once storage is allowed.
  const session = readJson("sessionStorage", ATTRIBUTION_KEY);
  if (session) writeJson("localStorage", ATTRIBUTION_KEY, session);
  loadTags();
}

export function denyConsent() {
  writeJson("localStorage", CONSENT_KEY, { choice: "denied", at: new Date().toISOString() });
  try { storage("localStorage")?.removeItem(ATTRIBUTION_KEY); } catch { /* ignore */ }
  gtag("consent", "update", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" });
}

// ---- Attribution -------------------------------------------------------------
/** Records first- and last-touch campaign data from the landing URL. */
export function captureAttribution(search = window.location.search, referrer = document.referrer) {
  const params = new URLSearchParams(search);
  const touch = {};
  for (const key of [...CAMPAIGN_PARAMS, ...CLICK_IDS]) {
    const value = params.get(key);
    if (value) touch[key] = value.slice(0, 200);
  }
  const hasCampaign = Object.keys(touch).length > 0;
  const stored = readJson("sessionStorage", ATTRIBUTION_KEY) || (getConsent() === "granted" ? readJson("localStorage", ATTRIBUTION_KEY) : null);
  const fresh = stored && Date.now() - new Date(stored.firstTouch?.at || 0).getTime() < ATTRIBUTION_TTL ? stored : null;
  if (!hasCampaign && fresh) return fresh;

  const external = referrer && !referrer.startsWith(window.location.origin) ? referrer.slice(0, 300) : "";
  const entry = { ...touch, landing: window.location.pathname, referrer: external, at: new Date().toISOString() };
  const next = { firstTouch: fresh?.firstTouch || entry, lastTouch: hasCampaign || !fresh ? entry : fresh.lastTouch };
  writeJson("sessionStorage", ATTRIBUTION_KEY, next);
  if (getConsent() === "granted") writeJson("localStorage", ATTRIBUTION_KEY, next);
  return next;
}

export function getAttribution() {
  return readJson("sessionStorage", ATTRIBUTION_KEY) || readJson("localStorage", ATTRIBUTION_KEY) || null;
}

/** Keeps campaign parameters when the page rewrites its own URL. */
export function preservedParams(search = window.location.search) {
  const params = new URLSearchParams(search);
  const kept = new URLSearchParams();
  for (const key of [...CAMPAIGN_PARAMS, ...CLICK_IDS, "lang"]) if (params.has(key)) kept.set(key, params.get(key));
  return kept;
}

// ---- Events ------------------------------------------------------------------
const ALLOWED_PARAMS = new Set(["method", "option", "value", "view", "setting", "language", "form", "design_code", "currency", "lead_id", "step", "system"]);
const fired = new Set();

/**
 * Pushes an analytics event. Only whitelisted, non-personal parameters are
 * forwarded. `once` limits an event to one push per page view.
 */
export function track(event, params = {}, { once = false } = {}) {
  if (typeof window === "undefined") return;
  if (once) {
    if (fired.has(event)) return;
    fired.add(event);
  }
  const clean = {};
  for (const [key, value] of Object.entries(params)) {
    if (ALLOWED_PARAMS.has(key) && ["string", "number", "boolean"].includes(typeof value)) clean[key] = typeof value === "string" ? value.slice(0, 100) : value;
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...clean });
  if (IDS.ga4 && tagsLoaded) gtag("event", event, clean);
}

/**
 * Fires the lead conversion exactly once per confirmed submission. Called only
 * after the backend accepted the record.
 */
export function trackLead(leadId) {
  const sent = readJson("sessionStorage", LEADS_KEY) || [];
  if (sent.includes(leadId)) return false;
  writeJson("sessionStorage", LEADS_KEY, [...sent, leadId].slice(-20));
  track("generate_lead", { lead_id: leadId, form: "pergola_quote" });
  if (IDS.ads && IDS.adsLeadLabel && tagsLoaded) {
    // transaction_id lets Google Ads drop duplicates of the same lead.
    gtag("event", "conversion", { send_to: `${IDS.ads}/${IDS.adsLeadLabel}`, transaction_id: leadId });
  }
  return true;
}
