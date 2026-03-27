import az from "./az";
import en from "./en";
import ru from "./ru";
import tr from "./tr";

export { getInitialLanguage, LANGUAGE_STORAGE_KEY, fallbackLanguage, localeOptions } from "./shared";

export const locales = {
  en,
  az,
  ru,
  tr,
};
