import { Link } from "react-router-dom";
import { fallbackLanguage } from "../locales";
import { locales } from "../locales";
import logoUrl from "../../branding/morphix-logo.svg";

function Footer({ language }) {
  const content = locales[language] ?? locales[fallbackLanguage];
  const f = content.footer;

  return (
    <footer className="site-footer">
      <div className="container footer-shell">
        <div className="footer-top">
          <div className="footer-brand">
            <Link className="brand-lockup footer-logo" to="/" aria-label={content.common.homeAriaLabel}>
              <img src={logoUrl} alt={content.common.brandName} />
            </Link>
            <p>{f.copy}</p>
            <Link className="primary-button footer-cta" to="/contact">
              {f.cta}
            </Link>
          </div>

          <div className="footer-column">
            <h3>{f.servicesTitle}</h3>
            <ul>
              {f.services.map((item) => (
                <li key={item}>
                  <Link to="/services">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h3>{f.companyTitle}</h3>
            <ul>
              {f.company.map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase()}`}>{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h3>{f.contactTitle}</h3>
            <ul>
              {f.contactItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>{f.copyright}</span>
          <div className="footer-links">
            <Link to="/services">{content.nav.services}</Link>
            <Link to="/playground">{content.nav.playground}</Link>
            <Link to="/work">{content.nav.work}</Link>
            <Link to="/pricing">{content.nav.pricing}</Link>
            <Link to="/contact">{content.nav.contact}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
