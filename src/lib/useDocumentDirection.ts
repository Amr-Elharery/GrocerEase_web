import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RTL_LANGUAGES, type SupportedLanguage } from "@/lib/i18n";

export function useDocumentDirection() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const applyDirection = (lng: string) => {
      const dir = RTL_LANGUAGES.includes(lng as SupportedLanguage) ? "rtl" : "ltr";
      document.documentElement.dir = dir;
      document.documentElement.lang = lng;
    };

    applyDirection(i18n.resolvedLanguage ?? i18n.language);
    i18n.on("languageChanged", applyDirection);
    return () => {
      i18n.off("languageChanged", applyDirection);
    };
  }, [i18n]);
}
