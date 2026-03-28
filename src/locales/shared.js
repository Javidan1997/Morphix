export const LANGUAGE_STORAGE_KEY = "morphix-language";

export const localeOptions = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "az", label: "Azərbaycan", flag: "🇦🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
];

export const fallbackLanguage = "en";

export function getInitialLanguage(locales) {
  if (typeof window === "undefined") {
    return fallbackLanguage;
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (storedLanguage && locales[storedLanguage]) {
    return storedLanguage;
  }

  const browserLanguage = window.navigator.language?.slice(0, 2).toLowerCase();
  if (browserLanguage && locales[browserLanguage]) {
    return browserLanguage;
  }

  return fallbackLanguage;
}
