
import { useTranslation } from "@/lib/i18n-context";
import { BadgeCheck, Shield, FileCheck, Users } from "lucide-react";

export function TrustSection() {
  const { t } = useTranslation();

  return (
    <div className="glass-card-solid rounded-2xl p-8 md:p-10 border-glow-subtle">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left: Security Statement */}
        <div className="flex items-start gap-4 max-w-md">
          <div className="shrink-0 bg-emerald-500/20 p-3 rounded-xl">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">{t("trust.title")}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t("trust.description")}
            </p>
          </div>
        </div>

        {/* Right: Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <TrustBadge icon={BadgeCheck} label={t("trust.idVerified")} />
          <TrustBadge icon={FileCheck} label={t("trust.backgroundChecks")} />
          <TrustBadge icon={Users} label={t("trust.reviewsSystem")} />
        </div>
      </div>
    </div>);

}

function TrustBadge({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2.5 rounded-lg border border-slate-700/50">
      <Icon className="w-4 h-4 text-emerald-400" />
      <span className="text-white/80 text-sm font-medium">{label}</span>
    </div>);

}