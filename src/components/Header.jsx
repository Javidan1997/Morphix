import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { localeOptions, fallbackLanguage } from "../locales";
import { locales } from "../locales";
import logoUrl from "../../branding/morphix-logo.svg";

function Header({ language, setLanguage }) {
  const location = useLocation();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const content = locales[language] ?? locales[fallbackLanguage];

  const currentOption = localeOptions.find((o) => o.code === language) || localeOptions[0];

  useEffect(() => {
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    setLangOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { to: "/", label: content.nav.home },
    { to: "/services", label: content.nav.services },
    { to: "/playground", label: content.nav.playground },
    { to: "/work", label: content.nav.work },
    { to: "/pricing", label: content.nav.pricing },
    { to: "/about", label: content.nav.about },
  ];

  return (
    <header className={`site-nav ${mobileMenuOpen ? "is-mobile-open" : ""}`}>
      <div className="nav-inner">
        <Link className="brand-lockup" to="/" aria-label={content.common.homeAriaLabel}>
          <img src={logoUrl} alt={content.common.brandName} />
        </Link>

        <nav className="nav-links" aria-label={content.common.primaryNavAriaLabel}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={location.pathname === link.to ? "is-active" : ""}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <div className="lang-dropdown" ref={dropdownRef}>
            <button
              className="lang-trigger"
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              aria-expanded={langOpen}
              aria-label={content.common.languageSwitcherLabel}
            >
              <span className="lang-flag">{currentOption.flag}</span>
              <span className="lang-code">{currentOption.code.toUpperCase()}</span>
              <svg className={`lang-chevron ${langOpen ? "is-open" : ""}`} width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {langOpen ? (
              <div className="lang-menu">
                {localeOptions.map((option) => (
                  <button
                    key={option.code}
                    className={`lang-option ${language === option.code ? "is-active" : ""}`}
                    type="button"
                    onClick={() => {
                      setLanguage(option.code);
                      setLangOpen(false);
                    }}
                  >
                    <span className="lang-flag">{option.flag}</span>
                    <span className="lang-option-label">{option.label}</span>
                    <span className="lang-option-code">{option.code.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <Link className="nav-cta" to="/contact">
            {content.nav.cta}
          </Link>
          <button
            className={`mobile-nav-toggle ${mobileMenuOpen ? "is-open" : ""}`}
            type="button"
            onClick={() => {
              setLangOpen(false);
              setMobileMenuOpen((value) => !value);
            }}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-site-nav"
            aria-label={
              mobileMenuOpen
                ? content.common.mobileNavCloseLabel
                : content.common.mobileNavOpenLabel
            }
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <button
        className={`mobile-nav-backdrop ${mobileMenuOpen ? "is-open" : ""}`}
        type="button"
        aria-label={content.common.mobileNavCloseLabel}
        onClick={() => setMobileMenuOpen(false)}
      />

      <div
        className={`mobile-nav-panel ${mobileMenuOpen ? "is-open" : ""}`}
        id="mobile-site-nav"
        aria-hidden={!mobileMenuOpen}
      >
        <nav className="mobile-nav-links" aria-label={content.common.primaryNavAriaLabel}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={location.pathname === link.to ? "is-active" : ""}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mobile-nav-footer">
          <Link className="primary-button mobile-nav-cta" to="/contact" onClick={() => setMobileMenuOpen(false)}>
            {content.nav.cta}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
