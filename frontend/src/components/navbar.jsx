import { useState } from "react";
import { useTranslation } from "@/lib/i18n-context";
import { User, Menu, X, Shield, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/language-toggle";





export function Navbar({ onSignInClick }) {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="mx-auto max-w-6xl">
        <div className="glass-strong rounded-2xl px-6 py-4 border-glow-subtle">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white tracking-tight">
                  {t("navbar.brand")}
                </span>
                <span className="text-[10px] text-emerald-400/80 font-medium -mt-0.5 flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3" />
                  {t("navbar.verifiedPlatform")}
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-3">
              {/* Language Toggle */}
              <LanguageToggle />

              {/* Login/Register Button */}
              <Button
                onClick={onSignInClick}
                className="trust-button rounded-xl px-6 py-2.5 border-0">
                
                <User className="w-4 h-4 mr-2" />
                {t("navbar.signIn")}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen &&
          <div className="md:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
              <div className="flex justify-center">
                <LanguageToggle />
              </div>
              <Button
              onClick={() => {
                setMobileMenuOpen(false);
                onSignInClick?.();
              }}
              className="trust-button rounded-xl px-6 py-3 border-0 w-full">
              
                <User className="w-5 h-5 mr-2" />
                {t("navbar.signIn")}
              </Button>
            </div>
          }
        </div>
      </div>
    </nav>);

}

