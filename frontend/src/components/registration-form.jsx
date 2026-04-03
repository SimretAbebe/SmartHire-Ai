
import { useState } from "react";
import { useTranslation } from "@/lib/i18n-context";
import { ArrowRight, Home, Briefcase, Users, BadgeCheck, Phone, Mail, MapPin, User, FileText, Building, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";






export function RegistrationForm({ role, onBack }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);

  const roleConfig = {
    helper: {
      icon: Home,
      color: "emerald",
      gradient: "from-emerald-500 to-emerald-600",
      shadow: "shadow-emerald-500/20"
    },
    employer: {
      icon: Briefcase,
      color: "teal",
      gradient: "from-teal-500 to-teal-600",
      shadow: "shadow-teal-500/20"
    },
    agent: {
      icon: Users,
      color: "cyan",
      gradient: "from-cyan-500 to-cyan-600",
      shadow: "shadow-cyan-500/20"
    }
  };

  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors group">
          
          <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
          <span>{t("registration.backToRoles")}</span>
        </button>
        
        <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${config.gradient} rounded-2xl mb-5 shadow-lg ${config.shadow}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
          {t(`registration.${role}.title`)}
        </h2>
        <p className="text-slate-400 text-lg">
          {t(`registration.${role}.subtitle`)}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {[1, 2, 3].map((s) =>
        <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
          step >= s ?
          `bg-gradient-to-br ${config.gradient} text-white` :
          "bg-slate-800 text-slate-500"}`
          }>
              {step > s ? <CheckCircle className="w-4 h-4" /> : s}
            </div>
            {s < 3 &&
          <div className={`w-12 h-0.5 ${step > s ? "bg-emerald-500" : "bg-slate-800"}`} />
          }
          </div>
        )}
      </div>

      {/* Form Card */}
      <div className="glass-card-solid rounded-2xl p-8">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {step === 1 &&
          <>
              <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t("registration.fullName")}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                  type="text"
                  placeholder={t("registration.fullNamePlaceholder")}
                  className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 h-12" />
                
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t("registration.phone")}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                  type="tel"
                  placeholder={t("registration.phonePlaceholder")}
                  className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 h-12" />
                
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t("registration.email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                  type="email"
                  placeholder={t("registration.emailPlaceholder")}
                  className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 h-12" />
                
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t("registration.location")}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                  type="text"
                  placeholder={t("registration.locationPlaceholder")}
                  className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 h-12" />
                
                </div>
              </div>
            </>
          }

          {step === 2 &&
          <>
              <h3 className="text-lg font-semibold text-white mb-4">
                {role === "helper" ? "Skills & Experience" : role === "employer" ? "Job Requirements" : "Agency Details"}
              </h3>

              {role === "agent" &&
            <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t("registration.agencyName")}
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                  type="text"
                  placeholder={t("registration.agencyNamePlaceholder")}
                  className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 h-12" />
                
                  </div>
                </div>
            }

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {role === "employer" ? t("registration.requirements") : t("registration.skills")}
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-4 w-5 h-5 text-slate-500" />
                  <textarea
                  placeholder={role === "employer" ? t("registration.requirementsPlaceholder") : t("registration.skillsPlaceholder")}
                  rows={4}
                  className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 focus:outline-none resize-none" />
                
                </div>
              </div>
            </>
          }

          {step === 3 &&
          <>
              <h3 className="text-lg font-semibold text-white mb-4">Identity Verification</h3>
              
              <div className="glass-card rounded-xl p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl shadow-lg shadow-emerald-500/20">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Fayda ID Verification</h4>
                    <p className="text-slate-400 text-sm">
                      {"Your identity will be verified using Ethiopia's national digital ID system to ensure platform safety."}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t("registration.faydaId")}
                </label>
                <div className="relative">
                  <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                  type="text"
                  placeholder={t("registration.faydaIdPlaceholder")}
                  className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 h-12" />
                
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500/20" />
              
                <span className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">
                  {t("registration.agreeTerms")}
                </span>
              </label>
            </>
          }

          {/* Navigation Buttons */}
          <div className="flex gap-4 pt-4">
            {step > 1 &&
            <Button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex-1 secondary-button py-6 rounded-xl">
              
                Back
              </Button>
            }
            
            {step < 3 ?
            <Button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex-1 trust-button py-6 rounded-xl border-0">
              
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button> :

            <Button
              type="submit"
              disabled={!agreed}
              className="flex-1 trust-button py-6 rounded-xl border-0 disabled:opacity-50 disabled:cursor-not-allowed">
              
                {t("registration.verifyId")}
                <BadgeCheck className="w-5 h-5 ml-2" />
              </Button>
            }
          </div>
        </form>
      </div>
    </div>);

}