
import { useState } from "react";
import { useTranslation } from "@/lib/i18n-context";
import { X, Shield, Eye, EyeOff, Phone, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";







export function SignInModal({ isOpen, onClose, onCreateAccount }) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState("phone");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose} />
      
      
      {/* Modal */}
      <div className="relative w-full max-w-md glass-strong rounded-2xl p-8 border-glow-subtle animate-fade-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all">
          
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl mb-4 shadow-lg shadow-emerald-500/20">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{t("signIn.title")}</h2>
          <p className="text-slate-400 text-sm">{t("signIn.subtitle")}</p>
        </div>

        {/* Login Method Toggle */}
        <div className="flex gap-2 mb-6 p-1 bg-slate-800/50 rounded-xl">
          <button
            onClick={() => setLoginMethod("phone")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
            loginMethod === "phone" ?
            "bg-emerald-600 text-white" :
            "text-slate-400 hover:text-white"}`
            }>
            
            <Phone className="w-4 h-4" />
            {t("signIn.phone")}
          </button>
          <button
            onClick={() => setLoginMethod("email")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
            loginMethod === "email" ?
            "bg-emerald-600 text-white" :
            "text-slate-400 hover:text-white"}`
            }>
            
            <Mail className="w-4 h-4" />
            {t("signIn.email")}
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {loginMethod === "email" ?
          <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t("signIn.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input
                type="email"
                placeholder={t("signIn.emailPlaceholder")}
                className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20" />
              
              </div>
            </div> :

          <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t("signIn.phone")}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input
                type="tel"
                placeholder="+251 9XX XXX XXX"
                className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20" />
              
              </div>
            </div>
          }

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {t("signIn.password")}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={t("signIn.passwordPlaceholder")}
                className="pl-11 pr-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20" />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
              {t("signIn.forgotPassword")}
            </button>
          </div>

          <Button type="submit" className="w-full trust-button py-6 rounded-xl border-0 text-base">
            {t("signIn.signInButton")}
          </Button>
        </form>

        {/* Create Account */}
        <div className="mt-6 text-center">
          <span className="text-slate-400 text-sm">{t("signIn.noAccount")} </span>
          <button
            onClick={onCreateAccount}
            className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors">
            
            {t("signIn.createAccount")}
          </button>
        </div>
      </div>
    </div>);

}