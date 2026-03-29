import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import {
  getInitialLanguage,
  LANGUAGE_STORAGE_KEY,
  fallbackLanguage,
} from "./locales";
import { locales } from "./locales";
import SceneCanvas from "./components/SceneCanvas";
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
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminContentEditor from "./pages/AdminContentEditor";
import AdminTemplates from "./pages/AdminTemplates";
import AdminMediaLibrary from "./pages/AdminMediaLibrary";
import AdminInquiries from "./pages/AdminInquiries";
import AdminAccess from "./pages/AdminAccess";
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

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.title = isAdminRoute ? "Configuro Admin" : content.meta.title;
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute(
        "content",
        isAdminRoute
          ? "Configuro admin panel for site operations, inquiries, and content readiness."
          : content.meta.description,
      );
    }
  }, [content.meta.description, content.meta.title, isAdminRoute, language]);

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

  return (
    <>
      {!isAdminRoute ? <SceneCanvas /> : null}
      <div className={isAdminRoute ? "admin-shell" : "page-shell"}>
        <ScrollToTop />
        {!isAdminRoute ? <Header language={language} setLanguage={setLanguage} /> : null}
        <Routes>
          <Route path="/" element={<Home content={content} />} />
          <Route path="/services" element={<Services content={content} />} />
          <Route path="/work" element={<Work content={content} />} />
          <Route path="/pricing" element={<Pricing content={content} />} />
          <Route path="/playground" element={<Playground content={content} />} />
          <Route path="/about" element={<About content={content} />} />
          <Route path="/contact" element={<Contact content={content} />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={(
              <AdminRoute>
                <Navigate replace to="/admin/overview" />
              </AdminRoute>
            )}
          />
          <Route
            path="/admin/overview"
            element={(
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            )}
          />
          <Route
            path="/admin/content"
            element={(
              <AdminRoute>
                <AdminContentEditor />
              </AdminRoute>
            )}
          />
          <Route
            path="/admin/templates"
            element={(
              <AdminRoute>
                <AdminTemplates />
              </AdminRoute>
            )}
          />
          <Route
            path="/admin/media"
            element={(
              <AdminRoute>
                <AdminMediaLibrary />
              </AdminRoute>
            )}
          />
          <Route
            path="/admin/inquiries"
            element={(
              <AdminRoute>
                <AdminInquiries />
              </AdminRoute>
            )}
          />
          <Route
            path="/admin/access"
            element={(
              <AdminRoute>
                <AdminAccess />
              </AdminRoute>
            )}
          />
        </Routes>
        {!isAdminRoute ? <Footer language={language} /> : null}
      </div>
    </>
  );
}

export default App;
