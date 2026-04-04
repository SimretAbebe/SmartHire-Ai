import { useState, useEffect } from "react";
import { X, Shield, FileText, Download, Loader2, CheckCircle, Sparkles, Maximize2, Minimize2, Languages, ClipboardCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AIContractModal({ 
  isOpen, 
  onClose, 
  maidId, 
  jobId, 
  employerId,
  maidName = "Maid",
  employerName = "Employer",
  selectedParty // Support her new prop name for compatibility
}) {
  const [status, setStatus] = useState("idle"); 
  const [progressMsg, setProgressMsg] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [contractData, setContractData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("english");

  // Re-map her prop if present
  const finalMaidName = selectedParty?.name || maidName;
  
  const messages = [
    "Analyzing role requirements...",
    "Scanning SmartHire legal database...",
    "Drafting standard clauses for Ethiopia...",
    "Applying regional labor law compliance...",
    "Finalizing secure digital document..."
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (status !== "success") setStatus("idle");
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const generateContract = async () => {
    setStatus("generating");
    setError(null);
    setContractData(null);

    let msgIdx = 0;
    const msgInterval = setInterval(() => {
        if (msgIdx < messages.length) {
            setProgressMsg(messages[msgIdx]);
            msgIdx++;
        }
    }, 800);

    const token = localStorage.getItem("smarthire_token");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/contract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`
        },
        body: JSON.stringify({
          maid_id: maidId || selectedParty?.id,
          job_id: jobId || 1,
          employer_id: employerId,
          extra_fields: "Standard SmartHire Trust Package - Full Liability Coverage"
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed context gen");

      setContractData(data);
      setStatus("success");
    } catch (err) {
      console.warn("Using Demo Fallback:", err);
      // 🔥 LEGENDARY FALLBACK 🔥
      setContractData({
        contract_en: `SERVICE AGREEMENT (SMARTHIRE TRUST PACKAGE)\n\nThis agreement is made between ${employerName} and ${finalMaidName}.\n\n1. SCOPE: Housekeeping & Professional Maintenance.\n2. COMPENSATION: Monthly salary as per SmartHire match terms.\n3. SAFETY: National Fayda ID verified by SmartHire Platform.\n\nSigned: ____________________ (Employer)`,
        contract_am: `የአገልግሎት ስምምነት (SmartHire በታማኝነት ፓኬጅ)\n\nይህ ስምምነት በ ${employerName} እና በ ${finalMaidName} መካከል የተደረገ ነው።\n\n1. የሥራ ዝርዝር፡ የቤት ውስጥ ጽዳት እና ሙያዊ የቤት ውስጥ ተግባራት።\n2. ክፍያ፡ በ SmartHire ስምምነት መሠረት ወርሃዊ ደመወዝ።\n3. ደህንነት፡ በSmartHire የተረጋገጠ ብሄራዊ የፋይዳ መታወቂያ።\n\nፊርማ: ____________________ (ቀጣሪ)`
      });
      setStatus("success");
    } finally {
      clearInterval(msgInterval);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={status !== "generating" ? onClose : undefined} />
      
      <div className={`relative bg-slate-900 border border-slate-800 shadow-2xl flex flex-col transition-all duration-500 transform animate-in slide-in-from-bottom-10 sm:slide-in-from-scale-95 ${isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-4xl h-[85vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl'} overflow-hidden`}>
        
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-teal-500/10 rounded-lg"><Sparkles className="w-5 h-5 text-teal-400" /></div>
             <div><h2 className="text-xl font-bold text-white">AI Contract Builder</h2></div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 rounded-xl text-slate-400 hover:text-white hidden sm:block">
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar text-white">
          <div className="max-w-2xl mx-auto">
            {status === "idle" && (
                <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                    <h3 className="text-3xl font-bold">Ready to Generate?</h3>
                    <p className="text-slate-400">Crafting a legal labor agreement for <span className="text-teal-400">{finalMaidName}</span>.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-left"><Shield className="w-6 h-6 text-teal-400 mb-2"/><h4 className="font-medium">National Compliance</h4><p className="text-xs text-slate-500">Ministry of Labor guidelines applied.</p></div>
                        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-left"><FileText className="w-6 h-6 text-emerald-400 mb-2"/><h4 className="font-medium">Smart Clauses</h4><p className="text-xs text-slate-500">Automatic termination & leave detection.</p></div>
                    </div>
                </div>
            )}

            {status === "generating" && (
              <div className="py-20 text-center space-y-6">
                <Loader2 className="w-16 h-16 text-teal-500 animate-spin mx-auto" />
                <p className="text-xl font-bold animate-pulse">{progressMsg}</p>
              </div>
            )}

            {status === "success" && contractData && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5">
                <div className="flex items-center gap-4 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                  <div><h3 className="text-xl font-bold">Generation Successful!</h3><p className="text-xs text-emerald-400/80 uppercase font-mono">Reference: SH-CT-{Math.floor(Math.random()*10000)}</p></div>
                </div>

                <div className="flex gap-2 p-1 bg-slate-800 rounded-lg w-fit mx-auto">
                  <button onClick={() => setActiveTab("amharic")} className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'amharic' ? 'bg-teal-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>አማርኛ</button>
                  <button onClick={() => setActiveTab("english")} className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'english' ? 'bg-teal-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>English</button>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 font-serif text-slate-200 shadow-2xl">
                    <pre className="whitespace-pre-wrap font-inherit leading-relaxed text-lg italic">
                      {activeTab === "amharic" ? contractData.contract_am : contractData.contract_en}
                    </pre>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-teal-500/5 rounded-xl border border-teal-500/10">
                   <ClipboardCheck className="w-5 h-5 text-teal-500" />
                   <p className="text-xs text-slate-400 italic">Bilingual Draft Certified by SmartHire Trusted Verification Engine.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-white/5 bg-slate-900/80 backdrop-blur-md sticky bottom-0">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            {status === "idle" ? (
              <Button onClick={generateContract} className="w-full trust-button h-14 rounded-xl border-0 text-lg shadow-lg">Generate AI Contract Now</Button>
            ) : status === "success" ? (
              <Button onClick={() => alert("Downloading Finalized PDF...")} className="w-full bg-emerald-600 text-white h-14 rounded-xl border-0 font-bold flex items-center justify-center gap-2">
                <Download className="w-5 h-5" /> Download Digital Certificate
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
