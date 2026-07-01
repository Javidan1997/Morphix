import { useState } from "react";
import { Link } from "react-router-dom";

// Client portal shell. Auth here is a lightweight front-end session so the flow
// is real and demoable; wire `signIn` to your backend / CRM when ready.
const SESSION_KEY = "configuro-portal-session";

function readSession() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

function Portal() {
  const [session, setSession] = useState(readSession);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const signIn = (e) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    const next = { email, since: new Date().toISOString() };
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    setSession(next);
    setError("");
  };

  const signOut = () => {
    window.localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setEmail("");
  };

  if (!session) {
    return (
      <main className="page-portal">
        <section className="page-header section-block">
          <div className="container">
            <div className="portal-auth-layout">
              <div className="portal-auth-copy reveal">
                <div className="eyebrow">Client portal</div>
                <h1 className="page-title">Your projects, in one place.</h1>
                <p className="page-subtitle">
                  Sign in to track project progress, review shared assets, and manage invoices.
                  New client? <Link to="/contact">Start a project</Link> or book a call below.
                </p>
                <div className="portal-book">
                  <h2>Prefer to talk first?</h2>
                  <p>Book a 30-minute call and we'll scope your project together.</p>
                  <a
                    className="secondary-button"
                    href="https://cal.com/configuro"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book a call
                  </a>
                </div>
              </div>

              <form className="glass-card portal-auth-form reveal" onSubmit={signIn} style={{ transitionDelay: "0.1s" }}>
                <h2>Sign in</h2>
                <label className="form-field">
                  Email
                  <input
                    type="email"
                    value={email}
                    placeholder="you@company.com"
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  />
                </label>
                {error ? <p className="portal-error" role="alert">{error}</p> : null}
                <button className="primary-button submit-button" type="submit">Continue</button>
                <p className="portal-fineprint">
                  Access is provisioned per engagement. If you don't have an account yet, get in touch.
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-portal">
      <section className="page-header section-block">
        <div className="container">
          <div className="portal-dash-head reveal">
            <div>
              <div className="eyebrow">Client portal</div>
              <h1 className="page-title">Welcome back.</h1>
              <p className="page-subtitle">Signed in as {session.email}</p>
            </div>
            <button className="secondary-button" type="button" onClick={signOut}>Sign out</button>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="container">
          <div className="portal-dash-grid">
            <article className="glass-card portal-panel reveal">
              <h2>Active projects</h2>
              <p className="portal-empty">No active projects yet. Once your engagement kicks off, milestones appear here.</p>
              <Link className="secondary-button" to="/contact">Start a project</Link>
            </article>
            <article className="glass-card portal-panel reveal" style={{ transitionDelay: "0.08s" }}>
              <h2>Shared files</h2>
              <p className="portal-empty">No files shared yet. Renders, builds, and deliverables will show up here.</p>
            </article>
            <article className="glass-card portal-panel reveal" style={{ transitionDelay: "0.16s" }}>
              <h2>Invoices</h2>
              <p className="portal-empty">No invoices yet. Billing history and payment links will appear here.</p>
            </article>
            <article className="glass-card portal-panel reveal" style={{ transitionDelay: "0.24s" }}>
              <h2>Book a call</h2>
              <p className="portal-empty">Need to talk something through? Grab a 30-minute slot.</p>
              <a className="secondary-button" href="https://cal.com/configuro" target="_blank" rel="noopener noreferrer">Book a call</a>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Portal;
