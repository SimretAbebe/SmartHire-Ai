
import { useTranslation } from "@/lib/i18n-context";

import { ArrowRight, BadgeCheck } from "lucide-react";










export function RoleCard({ icon: Icon, titleKey, subtitleKey, descriptionKey, accent, onClick }) {
  const { t } = useTranslation();

  const accentColors = {
    emerald: {
      bg: "from-emerald-500 to-emerald-600",
      shadow: "shadow-emerald-500/20",
      border: "group-hover:border-emerald-500/30",
      text: "text-emerald-400"
    },
    teal: {
      bg: "from-teal-500 to-teal-600",
      shadow: "shadow-teal-500/20",
      border: "group-hover:border-teal-500/30",
      text: "text-teal-400"
    },
    cyan: {
      bg: "from-cyan-500 to-cyan-600",
      shadow: "shadow-cyan-500/20",
      border: "group-hover:border-cyan-500/30",
      text: "text-cyan-400"
    }
  };

  const colors = accentColors[accent];

  return (
    <button
      onClick={onClick}
      className={`group relative w-full text-left glass-card-solid rounded-2xl p-8 ${colors.border} transition-all duration-300 hover:scale-[1.02]`}>
      
      {/* Icon Container */}
      <div className="mb-6">
        <div className={`bg-gradient-to-br ${colors.bg} p-4 rounded-xl w-fit shadow-lg ${colors.shadow}`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
      
      {/* Content */}
      <div className="mb-6">
        <p className={`text-sm font-medium ${colors.text} mb-2`}>{t(subtitleKey)}</p>
        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-white/90 transition-colors">
          {t(titleKey)}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          {t(descriptionKey)}
        </p>
      </div>

      {/* Verification Badge */}
      <div className="flex items-center gap-2 text-slate-500 text-xs mb-6">
        <BadgeCheck className="w-4 h-4 text-emerald-500" />
        <span>{t("roleSelection.verificationRequired")}</span>
      </div>
      
      {/* Arrow Indicator */}
      <div className={`flex items-center gap-2 ${colors.text} font-medium text-sm`}>
        <span>{t("roleSelection.continue")}</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </button>);

}