import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import {
  getInitialLanguage,
  LANGUAGE_STORAGE_KEY,
  fallbackLanguage,
} from "./locales";
import { locales } from "./locales";
import { pageSeo, buildJsonLd } from "./locales/seo";
import AmbientBackground from "./components/AmbientBackground";
import { initCinematicEffects, initGlobalEffects, initPlatformEffects } from "./cinematicEffects";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Work from "./pages/Work";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Playground from "./pages/Playground";
import Templates from "./pages/Templates";
import Insights from "./pages/Insights";
import InsightArticle from "./pages/InsightArticle";
import Portal from "./pages/Portal";
import PlatformLanding from "./pages/PlatformLanding";
import FreelanceHub from "./pages/FreelanceHub";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { useContentAdmin } from "./admin/ContentAdminContext";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const location = useLocation();
  const [language, setLanguage] = useState(() => getInitialLanguage(locales));
  const { mergedLocales } = useContentAdmin();
  const content = mergedLocales[language] ?? mergedLocales[fallbackLanguage];
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isPlatformRoute = ["/freelance", "/upwork", "/freelancer", "/fiverr", "/toptal", "/shopify"].includes(location.pathname);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;

    // Individual insight articles own their own SEO tags + Article JSON-LD.
    if (/^\/insights\/.+/.test(location.pathname)) return;

    const origin = "https://configuro.studio";
    const path = location.pathname;
    const url = `${origin}${path === "/" ? "/" : path}`;
    const seo = (pageSeo[language] || pageSeo.en)[path] ?? pageSeo.en[path];

    const title = isAdminRoute
      ? "Configuro Admin"
      : (seo?.title ?? content.meta.title);
    const description = isAdminRoute
      ? "Configuro admin panel for site operations, inquiries, and content readiness."
      : (seo?.description ?? content.meta.description);
    const noindex = isAdminRoute || seo?.noindex;

    document.title = title;

    const setMeta = (selector, attr, value) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    };
    const setMetaByName = (name, value) => {
      let el = document.head.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    setMeta('meta[name="description"]', "content", description);
    if (seo?.keywords) setMetaByName("keywords", seo.keywords);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('link[rel="canonical"]', "href", url);
    setMeta('meta[name="robots"]', "content", noindex ? "noindex, nofollow" : "index, follow");

    // Per-page structured data (JSON-LD).
    let ld = document.getElementById("page-jsonld");
    if (!isAdminRoute && seo) {
      if (!ld) {
        ld = document.createElement("script");
        ld.type = "application/ld+json";
        ld.id = "page-jsonld";
        document.head.appendChild(ld);
      }
      ld.textContent = JSON.stringify(buildJsonLd(path, seo));
    } else if (ld) {
      ld.remove();
    }
  }, [content.meta.description, content.meta.title, isAdminRoute, language, location.pathname]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );

    const observe = () => {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => observer.observe(el));
    };

    observe();
    const interval = setInterval(observe, 400);
    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isAdminRoute || isPlatformRoute) return undefined;
    let cleanup = () => {};
    const id = window.setTimeout(() => {
      cleanup = initCinematicEffects(document);
    }, 80);
    return () => {
      window.clearTimeout(id);
      cleanup();
    };
  }, [isAdminRoute, isPlatformRoute, location.pathname]);

  useEffect(() => {
    if (isAdminRoute || isPlatformRoute) return undefined;
    return initGlobalEffects();
  }, [isAdminRoute, isPlatformRoute]);

  useEffect(() => {
    if (!isPlatformRoute) return undefined;
    const cleanup = initPlatformEffects(document);
    return cleanup;
  }, [isPlatformRoute, location.pathname]);

  return (
    <>
      {!isAdminRoute && !isPlatformRoute ? <AmbientBackground /> : null}
      <div className={isAdminRoute ? "admin-shell" : `page-shell${isPlatformRoute ? " platform-page-shell" : ""}`}>
        <ScrollToTop />
        {!isAdminRoute ? <Header language={language} setLanguage={setLanguage} /> : null}
        <div className="route-fade" key={location.pathname}>
        <Routes>
          <Route path="/" element={<Home content={content} />} />
          <Route path="/services" element={<Services content={content} />} />
          <Route path="/work" element={<Work content={content} />} />
          <Route path="/pricing" element={<Pricing content={content} />} />
          <Route path="/playground" element={<Playground content={content} />} />
          <Route path="/templates" element={<Templates content={content} language={language} />} />
          <Route path="/about" element={<About content={content} />} />
          <Route path="/contact" element={<Contact content={content} />} />
          <Route path="/insights" element={<Insights content={content} />} />
          <Route path="/insights/:slug" element={<InsightArticle content={content} />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/freelance" element={<FreelanceHub />} />
          <Route path="/upwork" element={<PlatformLanding platform="upwork" />} />
          <Route path="/freelancer" element={<PlatformLanding platform="freelancer" />} />
          <Route path="/fiverr" element={<PlatformLanding platform="fiverr" />} />
          <Route path="/toptal" element={<PlatformLanding platform="toptal" />} />
          <Route path="/shopify" element={<PlatformLanding platform="shopify" />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={(
              <AdminRoute>
                <Navigate replace to="/admin/forms" />
              </AdminRoute>
            )}
          />
          <Route
            path="/admin/overview"
            element={(
              <AdminRoute>
                <Navigate replace to="/admin/forms" />
              </AdminRoute>
            )}
          />
          <Route
            path="/admin/forms"
            element={(
              <AdminRoute>
                <AdminDashboard view="forms" />
              </AdminRoute>
            )}
          />
          <Route
            path="/admin/statistics"
            element={(
              <AdminRoute>
                <AdminDashboard view="statistics" />
              </AdminRoute>
            )}
          />
          <Route
            path="/admin/interactions"
            element={(
              <AdminRoute>
                <AdminDashboard view="interactions" />
              </AdminRoute>
            )}
          />
          <Route
            path="/admin/content"
            element={(
              <AdminRoute>
                <Navigate replace to="/admin/forms" />
              </AdminRoute>
            )}
          />
          <Route
            path="/admin/templates"
            element={(
              <AdminRoute>
                <Navigate replace to="/admin/forms" />
              </AdminRoute>
            )}
          />
          <Route
            path="/admin/media"
            element={(
              <AdminRoute>
                <Navigate replace to="/admin/forms" />
              </AdminRoute>
            )}
          />
          <Route
            path="/admin/inquiries"
            element={(
              <AdminRoute>
                <Navigate replace to="/admin/interactions" />
              </AdminRoute>
            )}
          />
          <Route
            path="/admin/access"
            element={(
              <AdminRoute>
                <Navigate replace to="/admin/statistics" />
              </AdminRoute>
            )}
          />
        </Routes>
        </div>
        {!isAdminRoute ? <Footer language={language} /> : null}
      </div>
    </>
  );
}

export default App;
