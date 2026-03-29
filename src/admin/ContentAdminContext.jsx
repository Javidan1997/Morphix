import { createContext, useContext, useMemo, useState } from "react";
import { locales as baseLocales } from "../locales";

const CONTENT_OVERRIDES_STORAGE_KEY = "morphix.admin.content.overrides.v1";
const ContentAdminContext = createContext(null);

function cloneValue(value) {
  if (value === null || value === undefined || typeof value !== "object") {
    return value;
  }

  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
}

function getStoredOverrides() {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(CONTENT_OVERRIDES_STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function persistOverrides(overrides) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONTENT_OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
}

function mergeLocalesWithOverrides(overrides) {
  return Object.fromEntries(
    Object.entries(baseLocales).map(([localeCode, localeContent]) => [
      localeCode,
      {
        ...cloneValue(localeContent),
        ...(overrides[localeCode] ?? {}),
      },
    ]),
  );
}

export function ContentAdminProvider({ children }) {
  const [overrides, setOverrides] = useState(() => getStoredOverrides());

  const mergedLocales = useMemo(() => mergeLocalesWithOverrides(overrides), [overrides]);

  const value = useMemo(() => ({
    overrides,
    mergedLocales,
    localeCodes: Object.keys(baseLocales),
    getBaseSection: (localeCode, sectionKey) => cloneValue(baseLocales[localeCode]?.[sectionKey]),
    getMergedSection: (localeCode, sectionKey) => cloneValue(mergedLocales[localeCode]?.[sectionKey]),
    hasSectionOverride: (localeCode, sectionKey) => Boolean(overrides[localeCode]?.[sectionKey]),
    saveSection: (localeCode, sectionKey, sectionValue) => {
      setOverrides((current) => {
        const next = {
          ...current,
          [localeCode]: {
            ...(current[localeCode] ?? {}),
            [sectionKey]: cloneValue(sectionValue),
          },
        };
        persistOverrides(next);
        return next;
      });
    },
    resetSection: (localeCode, sectionKey) => {
      setOverrides((current) => {
        const localeOverrides = { ...(current[localeCode] ?? {}) };
        delete localeOverrides[sectionKey];

        const next = { ...current };
        if (Object.keys(localeOverrides).length) {
          next[localeCode] = localeOverrides;
        } else {
          delete next[localeCode];
        }

        persistOverrides(next);
        return next;
      });
    },
  }), [mergedLocales, overrides]);

  return (
    <ContentAdminContext.Provider value={value}>
      {children}
    </ContentAdminContext.Provider>
  );
}

export function useContentAdmin() {
  const context = useContext(ContentAdminContext);

  if (!context) {
    throw new Error("useContentAdmin must be used within a ContentAdminProvider.");
  }

  return context;
}
