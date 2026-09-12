import { useMemo, useRef, useState } from 'react';
import { createInquiry } from '../../admin/inquiries';

const MAX_SLOTS = 3;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function Arrow(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7"/></svg>;}

/** `datetime-local` gives a wall-clock string; pin it to the visitor's zone. */
function toIso(local) {
  const date = new Date(local);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}
/** Earliest selectable slot: tomorrow, as a `datetime-local` value. */
function minSlot() {
  const date = new Date(Date.now() + 864e5);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export default function BriefForm({ t, packageName, servicePrice, spec, configuration, packageId, lang, onDownload }) {
  const [values, setValues] = useState({ fullName: '', email: '', brief: '' });
  const [slots, setSlots] = useState(['']);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle');
  const liveRef = useRef(null);
  const min = useMemo(minSlot, []);
  const timezone = useMemo(() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch { return ''; }
  }, []);

  const set = (key, value) => {
    setValues(old => ({ ...old, [key]: value }));
    if (errors[key]) setErrors(old => ({ ...old, [key]: undefined }));
  };

  function validate() {
    const next = {};
    if (!values.fullName.trim()) next.fullName = t.formRequired;
    if (!values.email.trim()) next.email = t.formRequired;
    else if (!EMAIL.test(values.email.trim())) next.email = t.formBadEmail;
    if (!values.brief.trim()) next.brief = t.formRequired;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(event) {
    event.preventDefault();
    if (state === 'sending') return;
    if (!validate()) {
      // Move focus to the first problem so the error is not just a colour.
      const first = event.currentTarget.querySelector('[aria-invalid="true"]');
      first?.focus();
      return;
    }
    setState('sending');
    const meetingSlots = slots.map(toIso).filter(Boolean);
    try {
      await createInquiry({
        source: 'pergola-configurators',
        fullName: values.fullName,
        email: values.email,
        productName: packageName,
        budget: servicePrice,
        brief: [values.brief.trim(), '', spec].join('\n'),
        language: lang,
        meetingSlots,
        timezone,
        configuration: { packageId, ...configuration },
      });
      setState('sent');
    } catch (error) {
      console.warn('Configuro brief submission failed', error);
      setState('error');
    }
    liveRef.current?.focus();
  }

  if (state === 'sent') {
    return <div className="pcg-form-done" tabIndex={-1} ref={liveRef} role="status">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9.2"/><path d="m7.8 12.3 2.9 2.9 5.5-6"/></svg>
      <h3>{t.formSuccess}</h3>
      <button type="button" className="pcg-text-button" onClick={onDownload}>{t.download}</button>
    </div>;
  }

  return <form className="pcg-form" onSubmit={submit} noValidate>
    <div className="pcg-field-row">
      <label className="pcg-field">
        <span>{t.formName}</span>
        <input type="text" name="name" autoComplete="name" required maxLength={200} value={values.fullName}
          aria-invalid={errors.fullName ? 'true' : undefined}
          onChange={e => set('fullName', e.target.value)}/>
        {errors.fullName && <em>{errors.fullName}</em>}
      </label>
      <label className="pcg-field">
        <span>{t.formEmail}</span>
        <input type="email" name="email" autoComplete="email" required maxLength={320} value={values.email}
          aria-invalid={errors.email ? 'true' : undefined}
          onChange={e => set('email', e.target.value)}/>
        {errors.email && <em>{errors.email}</em>}
      </label>
    </div>

    <label className="pcg-field">
      <span>{t.formBrief}</span>
      <textarea name="brief" rows={4} required maxLength={4000} value={values.brief} placeholder={t.formBriefHint}
        aria-invalid={errors.brief ? 'true' : undefined}
        onChange={e => set('brief', e.target.value)}/>
      {errors.brief && <em>{errors.brief}</em>}
    </label>

    <fieldset className="pcg-slots">
      <legend>{t.formMeeting}</legend>
      <p className="pcg-slots-hint">{t.formMeetingHint}{timezone ? ` · ${t.formTimezone} (${timezone}).` : ''}</p>
      {slots.map((slot, i) => <div className="pcg-slot" key={i}>
        <label>
          <span className="pcg-sr">{`${t.formSlot} ${i + 1}`}</span>
          <input type="datetime-local" min={min} value={slot}
            onChange={e => setSlots(old => old.map((v, k) => (k === i ? e.target.value : v)))}/>
        </label>
        {slots.length > 1 && <button type="button" className="pcg-slot-remove"
          onClick={() => setSlots(old => old.filter((_, k) => k !== i))}>
          <span className="pcg-sr">{`${t.formRemoveSlot} ${i + 1}`}</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>}
      </div>)}
      {slots.length < MAX_SLOTS && <button type="button" className="pcg-text-button pcg-add-slot"
        onClick={() => setSlots(old => [...old, ''])}>+ {t.formAddSlot}</button>}
    </fieldset>

    <p className="pcg-form-attached">{t.formAttached}</p>
    {state === 'error' && <p className="pcg-form-error" role="alert" tabIndex={-1} ref={liveRef}>{t.formError}</p>}

    <button type="submit" className="pcg-primary" disabled={state === 'sending'}>
      {state === 'sending' ? t.formSending : t.formSubmit}{state === 'sending' ? null : <Arrow/>}
    </button>
    <small>{t.emailNote}</small>
  </form>;
}
