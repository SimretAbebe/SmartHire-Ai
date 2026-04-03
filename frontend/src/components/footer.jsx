import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { useTranslation } from "@/lib/i18n-context";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t, language, setLanguage } = useTranslation();

  return (
    <footer className="w-full bg-slate-950 text-slate-300 py-16 mt-24 border-t border-slate-800 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-emerald-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Setup */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200">
                {t("navbar.brand")}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                {t("footer.description")}
              </p>
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-slate-900 rounded-lg hover:bg-emerald-500/20 hover:text-emerald-400 transition-all border border-slate-800">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-slate-900 rounded-lg hover:bg-emerald-500/20 hover:text-emerald-400 transition-all border border-slate-800">
                <Linkedin size={18} />
              </a>
              <a href="#" className="p-2 bg-slate-900 rounded-lg hover:bg-emerald-500/20 hover:text-emerald-400 transition-all border border-slate-800">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-slate-900 rounded-lg hover:bg-emerald-500/20 hover:text-emerald-400 transition-all border border-slate-800">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-6 font-display">{t("footer.quickLinks")}</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-emerald-400 transition-colors inline-block hover:translate-x-1 transform duration-200">{t("footer.findJobs")}</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors inline-block hover:translate-x-1 transform duration-200">{t("footer.postJob")}</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors inline-block hover:translate-x-1 transform duration-200">{t("footer.companies")}</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors inline-block hover:translate-x-1 transform duration-200">{t("footer.pricing")}</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors inline-block hover:translate-x-1 transform duration-200">{t("footer.aboutUs")}</a></li>
            </ul>
          </div>

          {/* Legal & Resources */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-6 font-display">{t("footer.resources")}</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-emerald-400 transition-colors inline-block hover:translate-x-1 transform duration-200">{t("footer.helpCenter")}</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors inline-block hover:translate-x-1 transform duration-200">{t("footer.terms")}</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors inline-block hover:translate-x-1 transform duration-200">{t("footer.privacy")}</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors inline-block hover:translate-x-1 transform duration-200">{t("footer.cookie")}</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors inline-block hover:translate-x-1 transform duration-200">{t("footer.security")}</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-6 font-display">{t("footer.contact")}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                <span className="text-slate-400 leading-relaxed">{t("footer.addressTitle")}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-emerald-500 shrink-0" size={18} />
                <span className="text-slate-400">+251 9XX XXX XXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-emerald-500 shrink-0" size={18} />
                <a href="mailto:support@smarthire.ai" className="text-slate-400 hover:text-emerald-400 transition-colors">support@smarthire.ai</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="pt-8 pb-32 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {currentYear} {t("footer.rights")}
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <button onClick={() => setLanguage("en")} className={`hover:text-slate-300 transition-colors ${language === "en" ? "text-emerald-400" : ""}`}>English</button>
            <button onClick={() => setLanguage("am")} className={`hover:text-slate-300 transition-colors ${language === "am" ? "text-emerald-400" : ""}`}>Amharic</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
