import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import PergolaPage from "./PergolaPage.jsx";
import "./pergola.css";

const root = document.getElementById("root");
const app = (
  <StrictMode>
    <PergolaPage />
  </StrictMode>
);

// Production HTML is prerendered, so hydrate it in place. The dev server
// serves the empty template, which needs a normal render.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
