
import { useState } from "react";
import { useTranslation } from "@/lib/i18n-context";
import { MessageCircle, X, Send, Shield, Sparkles } from "lucide-react";

export function Chatbot() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Popup */}
      {isOpen &&
      <div className="fixed bottom-24 right-4 md:right-8 z-50 w-[calc(100vw-2rem)] max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="glass-strong rounded-2xl overflow-hidden border-glow-subtle">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600/30 to-teal-600/30 p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-xl shadow-lg shadow-emerald-500/20">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{t("chatbot.title")}</h3>
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{t("chatbot.online")}</span>
                    </div>
                  </div>
                </div>
                <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-lg">
                
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="p-4 min-h-[200px] max-h-[300px] overflow-y-auto bg-slate-900/50">
              {/* Bot Message */}
              <div className="flex gap-3">
                <div className="shrink-0 bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg h-fit">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-800/80 rounded-2xl rounded-tl-md p-4 max-w-[85%] border border-slate-700/50">
                  <p className="text-white/90 text-sm leading-relaxed">
                    {t("chatbot.greeting")}
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed mt-2">
                    {t("chatbot.helpMessage")}
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Footer */}
            <div className="p-4 border-t border-white/10 bg-slate-900/30">
              <div className="bg-slate-800/60 rounded-xl flex items-center gap-2 px-4 py-3 border border-slate-700/50">
                <input
                type="text"
                placeholder={t("chatbot.placeholder")}
                disabled
                className="flex-1 bg-transparent text-slate-500 placeholder:text-slate-600 text-sm outline-none cursor-not-allowed" />
              
                <button
                disabled
                className="bg-emerald-600/50 p-2 rounded-lg opacity-50 cursor-not-allowed">
                
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
              <p className="text-slate-600 text-xs text-center mt-2">{t("chatbot.privateMessage")}</p>
            </div>
          </div>
        </div>
      }

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 md:right-8 z-50 group"
        aria-label="Open chat assistant">
        
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
        <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300">
          {isOpen ?
          <X className="w-6 h-6 text-white" /> :

          <MessageCircle className="w-6 h-6 text-white" />
          }
        </div>
      </button>
    </>);

}