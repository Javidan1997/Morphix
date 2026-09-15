import { useEffect, useState } from "react";
import { denyConsent, getConsent, grantConsent, trackingConfigured } from "../analytics.js";

export const OPEN_CONSENT_EVENT = "configuro:consent-open";

/** Shown only when a tracking ID is configured and no choice is stored. */
export default function ConsentBanner({ t }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!trackingConfigured) return undefined;
    if (getConsent() === "unset") setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  if (!open) return null;
  return (
    <section className="pc-consent" aria-label={t.consentSettings}>
      <p>{t.consentText} <a href="#privacy">{t.form.privacyLink}</a></p>
      <div className="pc-consent-actions">
        <button type="button" className="pc-btn pc-btn-secondary" onClick={() => { denyConsent(); setOpen(false); }}>{t.consentDecline}</button>
        {/* Equal weight for both choices: no nudge toward accepting. */}
        <button type="button" className="pc-btn pc-btn-secondary" onClick={() => { grantConsent(); setOpen(false); }}>{t.consentAccept}</button>
      </div>
    </section>
  );
}
