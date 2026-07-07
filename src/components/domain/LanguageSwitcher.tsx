import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current = (i18n.resolvedLanguage ?? i18n.language) as SupportedLanguage;

  const toggle = () => {
    const next = SUPPORTED_LANGUAGES.find((lng) => lng !== current) ?? "en";
    i18n.changeLanguage(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title={t("language.label")}
      aria-label={t("language.label")}
      className="flex h-9 items-center gap-1.5 rounded-full px-2.5 text-xs font-bold uppercase text-[#5F7168] transition hover:bg-[#E8F0EA] hover:text-[#101828]"
    >
      <Languages className="h-4 w-4 shrink-0" />
      {current === "ar" ? t("language.en") : t("language.ar")}
    </button>
  );
}
