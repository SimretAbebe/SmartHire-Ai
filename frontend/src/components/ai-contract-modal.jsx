import { useState, useEffect } from "react";
import { X, Shield, FileText, Download, Loader2, CheckCircle, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AIContractModal({ isOpen, onClose, selectedParty }) {
  const [status, setStatus] = useState("idle"); // idle, generating, success, error
  const [progressMsg, setProgressMsg] = useState("");
  
  const messages = [
    "Analyzing role requirements...",
    "Scanning SmartHire legal database...",
    "Drafting standard clauses for Ethiopia...",
    "Applying regional labor law compliance...",
    "Generating secure digital signature keys...",
    "Finalizing contract document..."
  ];

  useEffect(() => {
    if (status === "generating") {
      let i = 0;
      const interval = setInterval(() => {
        if (i < messages.length) {
          setProgressMsg(messages[i]);
          i++;
        } else {
          clearInterval(interval);
          setStatus("success");
        }
      }, 800);
      return () => clearInterval(interval);
    }
  }, [status]);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setStatus("generating");
  };

  const handleDownload = () => {
    // Mock PDF download
    alert(`Downloading AI Contract for ${selectedParty?.name || "Helper"}...`);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={status !== "generating" ? onClose : undefined} />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg glass-strong rounded-3xl p-8 border border-white/10 shadow-2xl animate-fade-up overflow-hidden">
        {/* Background Sparkle Effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/20 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/20 blur-[80px] rounded-full pointer-events-none" />

        {/* Close Button */}
        {status !== "generating" && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl mb-6 shadow-xl shadow-teal-500/20 relative">
            {status === "generating" ? (
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            ) : status === "success" ? (
              <CheckCircle className="w-10 h-10 text-white" />
            ) : (
              <Sparkles className="w-10 h-10 text-white" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            {status === "idle" ? "SmartHire AI Contract" : 
             status === "generating" ? "Generating Contract..." :
             "Contract Ready!"}
          </h2>
          
          <p className="text-slate-400 mb-8 px-4">
            {status === "idle" ? `Generate a legally binding labor contract for ${selectedParty?.name || "the selected candidate"} automatically.` :
             status === "generating" ? progressMsg :
             "The AI has successfully drafted a comprehensive contract based on your requirements."}
          </p>

          {status === "idle" && (
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl text-left">
                <Shield className="w-5 h-5 text-teal-400 shrink-0" />
                <span className="text-sm text-slate-300">Compliant with Ethiopian labor regulations</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl text-left">
                <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-sm text-slate-300">Automatic clause generation based on job type</span>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                <span className="text-slate-400 text-sm">Contract ID:</span>
                <span className="text-emerald-400 font-mono text-sm uppercase">SH-2024-AI-9X2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Valid for:</span>
                <span className="text-white font-medium text-sm">{selectedParty?.name || "Helper"}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {status === "idle" ? (
              <Button 
                onClick={handleGenerate}
                className="w-full trust-button h-14 rounded-xl border-0 text-lg shadow-lg shadow-teal-500/20"
              >
                Generate Contract Now
              </Button>
            ) : status === "success" ? (
              <>
                <Button 
                  onClick={handleDownload}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white h-14 rounded-xl border-0 text-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download PDF Contract
                </Button>
                <Button 
                  onClick={onClose}
                  variant="outline"
                  className="w-full h-14 rounded-xl border-slate-700 text-slate-400 hover:text-white"
                >
                  Done
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
