// Build-time renderer used by scripts/prerender.mjs.
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import PergolaPage from "./PergolaPage.jsx";
import { COPY } from "./copy.js";

export function render() {
  return renderToString(
    <StrictMode>
      <PergolaPage />
    </StrictMode>,
  );
}

export const copy = COPY.en;
