
import { useTranslation } from "@/lib/i18n-context";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "am" : "en");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
      aria-label="Toggle language">
      
      <Globe className="w-4 h-4 text-emerald-400" />
      <span className="text-sm font-medium text-white/90">{language === "en" ? "ENG" : "AMH"}</span>
    </button>);

}