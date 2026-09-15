// Quote request submission for /pergola-configurator.
//
// Unlike the generic createInquiry() helper, this waits for the database to
// accept the row before resolving, so the success state and the ad conversion
// are only ever shown for a request that was actually stored.
import { syncInquiryToErpNext } from "../admin/erpnextSync";
import { insertSupabaseInquiry, isSupabaseConfigured } from "../admin/supabaseInquiries";

export const SOURCE = "pergola-configurator";

export function newLeadId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function submitLead({ id, values, design, attribution, language, interest }) {
  if (!isSupabaseConfigured()) throw new Error("Lead storage is not configured for this build.");
  const inquiry = {
    id,
    status: "new",
    receivedAt: new Date().toISOString(),
    source: SOURCE,
    fullName: values.name.trim(),
    email: values.email.trim(),
    company: values.company.trim(),
    website: values.website.trim(),
    productName: "Pergola configurator",
    projectType: values.role,
    interest: interest || "",
    brief: `${interest ? `${interest}\n\n` : ""}${values.message.trim()}${design ? `\n\n---\n${design.summary}\n${design.url}` : ""}`.slice(0, 19000),
    language,
    configuration: design ? { code: design.code, url: design.url, config: design.config, estimate: design.estimate } : null,
    attribution: attribution ? { firstTouch: attribution.firstTouch, lastTouch: attribution.lastTouch } : null,
  };
  // Throws on any non-2xx response (network failure, RLS rejection, outage).
  await insertSupabaseInquiry(inquiry);
  // CRM sync is best effort: the lead is already safely stored.
  syncInquiryToErpNext(inquiry).catch((error) => console.warn("Configuro lead stored; CRM sync failed.", error));
  return inquiry;
}
