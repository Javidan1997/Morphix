import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { getAttribution, track, trackLead } from "../analytics.js";
import { format } from "../copy.js";
import { newLeadId, submitLead } from "../submitLead.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URLISH = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i;
const EMPTY = { name: "", email: "", company: "", website: "", role: "manufacturer", message: "", attach: true, consent: false, trap: "" };
const LIMITS = { name: 200, email: 320, company: 200, website: 300, message: 4000 };

export default function QuoteForm({ t, lang, design, interest, onClearInterest }) {
  const f = t.form;
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle");
  const [lead, setLead] = useState(null);
  // One id per filled-in form: retries after an error reuse it, so a request
  // that did reach the database is never counted as two conversions.
  const leadId = useRef(null);
  const statusRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => { if (state === "sent" || state === "error") statusRef.current?.focus(); }, [state]);

  const set = (key, value) => {
    setValues((old) => ({ ...old, [key]: value }));
    if (errors[key]) setErrors((old) => ({ ...old, [key]: undefined }));
  };

  function validate() {
    const next = {};
    if (!values.name.trim()) next.name = f.required;
    if (!values.email.trim()) next.email = f.required;
    else if (!EMAIL.test(values.email.trim())) next.email = f.badEmail;
    if (!values.company.trim()) next.company = f.required;
    if (values.website.trim() && !URLISH.test(values.website.trim())) next.website = f.badUrl;
    if (!values.message.trim()) next.message = f.required;
    if (!values.consent) next.consent = f.consentRequired;
    setErrors(next);
    return next;
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (state === "sending") return;
    const problems = validate();
    if (Object.keys(problems).length) {
      track("quote_validation_error", { value: Object.keys(problems).length });
      const first = Object.keys(EMPTY).find((key) => problems[key]);
      formRef.current?.querySelector(`[name="${first}"]`)?.focus();
      return;
    }
    // Bots fill the hidden field; pretend success without storing anything.
    if (values.trap) { setState("sent"); return; }
    leadId.current ||= newLeadId();
    setState("sending");
    track("quote_submit", { form: "pergola_quote" });
    try {
      await submitLead({
        id: leadId.current,
        values,
        design: values.attach ? design() : null,
        interest,
        attribution: getAttribution(),
        language: lang,
      });
      trackLead(leadId.current);
      setLead(leadId.current);
      setState("sent");
    } catch (error) {
      console.warn("Quote request failed", error);
      track("quote_error", { form: "pergola_quote" });
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="pc-form-done" role="status" tabIndex={-1} ref={statusRef}>
        <CheckCircle size={36} weight="light" aria-hidden="true" />
        <h3>{f.successTitle}</h3>
        <p>{f.successText}</p>
        {lead && <p className="pc-note">{f.reference}: <code translate="no">{lead.slice(0, 8)}</code></p>}
        <button type="button" className="pc-btn pc-btn-secondary" onClick={() => { leadId.current = null; setValues(EMPTY); setLead(null); setState("idle"); }}>{f.another}</button>
      </div>
    );
  }

  const field = (key, props) => ({
    id: `pc-q-${key}`,
    name: key,
    value: values[key],
    maxLength: LIMITS[key],
    "aria-invalid": errors[key] ? "true" : undefined,
    "aria-describedby": errors[key] ? `pc-q-${key}-error` : props?.hint ? `pc-q-${key}-hint` : undefined,
    onChange: (event) => set(key, event.target.value),
  });
  const error = (key) => errors[key] && <p className="pc-error" id={`pc-q-${key}-error`}>{errors[key]}</p>;
  const mailto = `mailto:hello@configuro.studio?subject=${encodeURIComponent(t.quoteTitle)}&body=${encodeURIComponent(values.attach ? design().summary : "")}`;

  return (
    <form className="pc-form" ref={formRef} onSubmit={onSubmit} noValidate onFocus={() => track("quote_start", { form: "pergola_quote" }, { once: true })}>
      <div className="pc-form-grid">
        <div className="pc-input">
          <label htmlFor="pc-q-name">{f.name}</label>
          <input type="text" autoComplete="name" placeholder={f.namePlaceholder} required {...field("name")} />
          {error("name")}
        </div>
        <div className="pc-input">
          <label htmlFor="pc-q-email">{f.email}</label>
          <input type="email" inputMode="email" autoComplete="email" spellCheck={false} placeholder={f.emailPlaceholder} required {...field("email")} />
          {error("email")}
        </div>
        <div className="pc-input">
          <label htmlFor="pc-q-company">{f.company}</label>
          <input type="text" autoComplete="organization" placeholder={f.companyPlaceholder} required {...field("company")} />
          {error("company")}
        </div>
        <div className="pc-input">
          <label htmlFor="pc-q-website">{f.website} <span className="pc-optional">({f.optional})</span></label>
          <input type="url" inputMode="url" autoComplete="url" spellCheck={false} placeholder={f.websitePlaceholder} {...field("website")} />
          {error("website")}
        </div>
      </div>

      <fieldset className="pc-input">
        <legend>{f.role}</legend>
        <div className="pc-segmented-row pc-roles">
          {Object.entries(f.roles).map(([key, label]) => (
            <label key={key} className="pc-segment">
              <input type="radio" name="role" value={key} checked={values.role === key} onChange={() => set("role", key)} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="pc-input">
        <label htmlFor="pc-q-message">{f.message}</label>
        <textarea rows={4} placeholder={f.messageHint} required {...field("message", { hint: true })} />
        <p className="pc-note" id="pc-q-message-hint">{f.messageHint}</p>
        {error("message")}
      </div>

      <div className="pc-trap" aria-hidden="true">
        <label htmlFor="pc-q-trap">Leave this field empty</label>
        <input id="pc-q-trap" name="trap" tabIndex={-1} autoComplete="off" value={values.trap} onChange={(event) => set("trap", event.target.value)} />
      </div>

      {interest && (
        <p className="pc-interest">
          <span>{t.interest}: <strong>{interest}</strong></span>
          <button type="button" className="pc-linklike" onClick={onClearInterest}>{t.removeInterest}</button>
        </p>
      )}
      <label className="pc-check">
        <input type="checkbox" name="attach" checked={values.attach} onChange={(event) => set("attach", event.target.checked)} />
        <span><strong>{f.attach}</strong><small>{format(f.attachNote, { code: design().code })}</small></span>
      </label>
      <label className="pc-check" data-invalid={errors.consent ? "" : undefined}>
        <input type="checkbox" name="consent" checked={values.consent} aria-invalid={errors.consent ? "true" : undefined}
          aria-describedby={errors.consent ? "pc-q-consent-error" : undefined} onChange={(event) => set("consent", event.target.checked)} />
        <span>{f.consent} <a href="#privacy">{f.privacyLink}</a></span>
      </label>
      {error("consent")}

      {state === "error" && (
        <div className="pc-form-error" role="alert" tabIndex={-1} ref={statusRef}>
          <WarningCircle size={20} weight="bold" aria-hidden="true" />
          <p>{f.error} <a href={mailto}>{f.emailInstead}</a></p>
        </div>
      )}
      <div className="pc-form-actions">
        <button type="submit" className="pc-btn pc-btn-primary" disabled={state === "sending"} aria-disabled={state === "sending"}>
          {state === "sending" ? f.sending : state === "error" ? f.retry : f.submit}
          {state !== "sending" && <span className="pc-btn-icon" aria-hidden="true"><ArrowRight size={16} weight="bold" /></span>}
        </button>
      </div>
      <p className="pc-sr" aria-live="polite">{state === "sending" ? f.sending : ""}</p>
    </form>
  );
}
