// Fallback used when the main SPA router lands on /pergola-configurator
// (dev without the entry rewrite, or an in-app navigation).
import PergolaPage from "./PergolaPage.jsx";
import "./pergola.css";
// Loaded after the base sheet so mobile overrides win the cascade.
import "./pergola-mobile.css";

export default PergolaPage;
