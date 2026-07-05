import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const SUPPORTED_LANGUAGES = ["en", "ar"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const RTL_LANGUAGES: SupportedLanguage[] = ["ar"];
export const LANGUAGE_STORAGE_KEY = "zad-language";

// Namespaces are code-split: each `${lng}/${ns}.json` becomes its own chunk
// and is only fetched the first time a component calls useTranslation(ns).
const lazyResourcesBackend = {
  type: "backend" as const,
  init: () => {},
  read(
    language: string,
    namespace: string,
    callback: (error: unknown, data: unknown) => void
  ) {
    import(`../locales/${language}/${namespace}.json`)
      .then((mod) => callback(null, mod.default))
      .catch((error) => callback(error, null));
  },
};

i18n
  .use(lazyResourcesBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: [...SUPPORTED_LANGUAGES],
    ns: ["common", "layout"],
    defaultNS: "common",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
