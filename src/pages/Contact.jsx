import { useState } from "react";
import MediaSlotsSection from "../components/MediaSlotsSection";
import { createInquiry } from "../admin/inquiries";

const defaultIntake = {
  fullName: "",
  email: "",
  company: "",
  website: "",
  productName: "",
  brief: "",
  projectType: "",
  productStage: "",
  goals: [],
  deliverables: [],
  timeline: "",
  budget: "",
};

function Contact({ content }) {
  const { contactPage, contactMediaGallery } = content;
  const { wizard, fields, groups, stepLayout } = contactPage;
  const [step, setStep] = useState(0);
  const [intake, setIntake] = useState(defaultIntake);
  const [submitted, setSubmitted] = useState(false);
  const [submissionSaved, setSubmissionSaved] = useState(false);

  const totalSteps = wizard.steps.length;
  const currentStep = wizard.steps[step];
  const currentLayout = stepLayout[step];
  const progress = ((step + 1) / totalSteps) * 100;

  const updateField = (field, value) => {
    setSubmitted(false);
    setSubmissionSaved(false);
    setIntake((prev) => ({ ...prev, [field]: value }));
  };

  const toggleValue = (field, value) => {
    setSubmitted(false);
    setSubmissionSaved(false);
    setIntake((prev) => {
      const current = prev[field];
      if (Array.isArray(current)) {
        return {
          ...prev,
          [field]: current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value],
        };
      }
      return { ...prev, [field]: current === value ? "" : value };
    });
  };

  const goNext = () => {
    if (step === totalSteps - 1) {
      if (!submissionSaved) {
        createInquiry({
          ...intake,
          source: "contact-wizard",
        });
        setSubmissionSaved(true);
      }
      setSubmitted(true);
      return;
    }
    setStep((s) => Math.min(totalSteps - 1, s + 1));
  };

  const goBack = () => {
    setSubmitted(false);
    setStep((s) => Math.max(0, s - 1));
  };

  return (
    <main className="page-contact">
      <section className="page-header section-block">
        <div className="container">
          <div className="eyebrow reveal">{contactPage.eyebrow}</div>
          <h1 className="page-title reveal">{contactPage.headline}</h1>
          <p className="page-subtitle reveal">{contactPage.copy}</p>
        </div>
      </section>

      <section className="section-block contact-block">
        <div className="container">
          <div className="contact-layout">
            {/* Sidebar */}
            <div className="contact-sidebar reveal">
              <div className="contact-facts">
                {contactPage.facts.map((fact) => (
                  <div className="contact-fact" key={fact}>
                    <span className="contact-fact-dot" />
                    <span>{fact}</span>
                  </div>
                ))}
              </div>

              {/* Step navigation */}
              <div className="wizard-nav">
                {wizard.steps.map((s, i) => (
                  <button
                    key={s.title}
                    className={`wizard-nav-step ${i === step ? "is-active" : ""} ${i < step ? "is-done" : ""}`}
                    type="button"
                    onClick={() => { setSubmitted(false); setStep(i); }}
                  >
                    <span className="wizard-nav-number">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <strong>{s.title}</strong>
                      <p>{s.copy}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Wizard form */}
            <form
              className="glass-card contact-form wizard-form reveal"
              style={{ transitionDelay: "0.1s" }}
              onSubmit={(e) => { e.preventDefault(); goNext(); }}
            >
              {/* Progress bar */}
              <div className="wizard-progress">
                <div className="wizard-progress-bar" style={{ width: `${progress}%` }} />
              </div>

              <div className="wizard-header">
                <span className="wizard-step-label">
                  {wizard.stepLabel} {step + 1} / {totalSteps}
                </span>
                <h3>{currentStep.title}</h3>
                <p>{currentStep.copy}</p>
              </div>

              {submitted ? (
                <div className="contact-success">
                  <strong>{wizard.successTitle}</strong>
                  <p>{wizard.successCopy}</p>
                </div>
              ) : (
                <div className="wizard-body">
                  {/* Text fields */}
                  {currentLayout.fieldKeys?.length ? (
                    <div className="form-row-auto">
                      {currentLayout.fieldKeys.map((fieldKey) => {
                        const f = fields[fieldKey];
                        if (!f) return null;
                        const isTextarea = fieldKey === "brief";
                        return (
                          <label
                            key={fieldKey}
                            className={`form-field ${isTextarea ? "form-field-wide" : ""}`}
                          >
                            {f.label}
                            {isTextarea ? (
                              <textarea
                                rows="4"
                                value={intake[fieldKey]}
                                placeholder={f.placeholder}
                                onChange={(e) => updateField(fieldKey, e.target.value)}
                              />
                            ) : (
                              <input
                                type={fieldKey === "email" ? "email" : "text"}
                                value={intake[fieldKey]}
                                placeholder={f.placeholder}
                                onChange={(e) => updateField(fieldKey, e.target.value)}
                              />
                            )}
                          </label>
                        );
                      })}
                    </div>
                  ) : null}

                  {/* Option groups */}
                  {currentLayout.groupKeys?.map((groupKey) => {
                    const group = groups[groupKey];
                    if (!group) return null;
                    const currentValue = intake[groupKey];

                    return (
                      <div className="wizard-group" key={groupKey}>
                        <div className="wizard-group-head">
                          <strong>{group.label}</strong>
                          <p>{group.description}</p>
                        </div>
                        <div className={`wizard-options ${group.multi ? "" : "is-single"}`}>
                          {group.options.map((option) => {
                            const isActive = Array.isArray(currentValue)
                              ? currentValue.includes(option.value)
                              : currentValue === option.value;
                            return (
                              <button
                                key={option.value}
                                className={`wizard-option ${isActive ? "is-active" : ""}`}
                                type="button"
                                aria-pressed={isActive}
                                onClick={() => toggleValue(groupKey, option.value)}
                              >
                                {option.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Actions */}
              {!submitted ? (
                <div className="wizard-actions">
                  <button
                    className="secondary-button"
                    type="button"
                    disabled={step === 0}
                    onClick={goBack}
                  >
                    {wizard.previous}
                  </button>
                  <button className="primary-button submit-button" type="submit">
                    {step === totalSteps - 1 ? wizard.submit : wizard.next}
                  </button>
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </section>

      <MediaSlotsSection copy={contactMediaGallery} />
    </main>
  );
}

export default Contact;
