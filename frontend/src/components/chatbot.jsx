import { useState } from "react";
import { useTranslation } from "@/lib/i18n-context";
import { MessageCircle, X, Send, Shield, Sparkles, User } from "lucide-react";

export function Chatbot() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: "bot", content: t("chatbot.greeting") },
    { id: 2, type: "bot", content: t("chatbot.helpMessage") }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = { id: Date.now(), type: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const botResponse = { 
        id: Date.now() + 1, 
        type: "bot", 
        content: "I'm here to help! Whether you're looking to hire or find work, SmartHire uses AI to ensure the best matches and platform safety through Fayda ID verification. What specific information can I provide?" 
      };
      setMessages(prev => [...prev, botResponse]);
    }, 2000);
  };

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
            <div className="p-4 h-[350px] overflow-y-auto bg-slate-900/50 space-y-4 scroll-smooth">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.type === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`shrink-0 p-2 rounded-lg h-fit ${
                    msg.type === "bot" 
                      ? "bg-gradient-to-br from-emerald-500 to-teal-600" 
                      : "bg-slate-700"
                  }`}>
                    {msg.type === "bot" ? <Sparkles className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`rounded-2xl p-4 max-w-[85%] border shadow-sm ${
                    msg.type === "bot"
                      ? "bg-slate-800/80 rounded-tl-md border-slate-700/50 text-white/90"
                      : "bg-emerald-600/20 rounded-tr-md border-emerald-500/20 text-emerald-50"
                  }`}>
                    <p className="text-sm leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 animate-in fade-in duration-300">
                  <div className="shrink-0 bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg h-fit">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-800/80 rounded-2xl rounded-tl-md p-4 border border-slate-700/50 flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            {/* Chat Footer */}
            <div className="p-4 border-t border-white/10 bg-slate-900/30">
              <form onSubmit={handleSend} className="bg-slate-800/60 rounded-xl flex items-center gap-2 px-4 py-3 border border-slate-700/50 group focus-within:border-emerald-500/50 transition-colors">
                <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("chatbot.placeholder")}
                className="flex-1 bg-transparent text-white placeholder:text-slate-500 text-sm outline-none" />
              
                <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-emerald-600 p-2 rounded-lg hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                
                  <Send className="w-4 h-4 text-white" />
                </button>
              </form>
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