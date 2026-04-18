import { useState, useRef } from "react";
import { useTranslation } from "@/lib/i18n-context";
import { ArrowRight, Home, Briefcase, Users, BadgeCheck, Phone, Mail, MapPin, User, FileText, Building, Shield, CheckCircle, X, Search, Loader2, Star, Sparkles, Camera, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIContractModal } from "./ai-contract-modal";

const ETHIOPIAN_REGIONS = {
  "Addis Ababa": ["Bole", "Kirkos", "Arada", "Gullele", "Akaki", "Kolfe Keranio", "Lideta", "Yeka"],
  "Amhara": ["Bahir Dar", "Gondar", "Dessie", "Debre Berhan", "Kombolcha"],
  "Oromia": ["Adama", "Bishoftu", "Jimma", "Shashemene", "Nekemte"],
  "Tigray": ["Mekelle", "Shire", "Aksum", "Adigrat"],
  "Sidama": ["Hawassa", "Yirgalem"],
  "SNNPR": ["Arba Minch", "Wolaita Sodo", "Hossana"],
  "Dire Dawa": ["Dire Dawa"],
  "Harari": ["Harar"]
};

export function RegistrationForm({ role, onBack }) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);
  const [matchmakingMessage, setMatchmakingMessage] = useState("");
  const [matches, setMatches] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showSuccessCard, setShowSuccessCard] = useState(false);

  // Data trackers for payload
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [faydaId, setFaydaId] = useState("");
  const [tinNumber, setTinNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const currentMaxStep = (role === "employer" || role === "agent") ? 4 : 3;

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (step < currentMaxStep) return;
    
    setIsSubmitting(true);
    setErrorMsg("");
    
    const backendRole = role === "helper" ? "maid" : role;
    
    try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("phone", phone);
        formData.append("password", password);
        formData.append("role", backendRole);
        if (age) formData.append("age", age);
        if (gender) formData.append("gender", gender);
        if (profilePhoto) formData.append("profile_photo", profilePhoto);
        if (faydaId) formData.append("fayda_id", faydaId);
        if (tinNumber) formData.append("tin_number", tinNumber);
        
        // Also capture location info for the profile
        formData.append("city", city);
        formData.append("region", region);
        formData.append("location", `${city}, ${region}`);

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/register`, {
            method: "POST",
            body: formData // Fetch automatically sets content-type for FormData
        });
        
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.errors ? JSON.stringify(data.errors) : (data.error || "Registration error occurred."));
        }
        
        setIsSubmitting(false);

        if (role !== "employer") {
            setShowSuccessCard(true);
        } else {
           alert(t("registration.success") || "Identity Verified! Welcome to SmartHire AI.");
        }
    } catch(err) {
        setIsSubmitting(false);
        setErrorMsg(err.message);
    }
  };

  const handleFindMatches = () => {
    setIsLoadingMatches(true);
    setMatchmakingMessage("Scanning 50+ nearby helpers...");
    setTimeout(() => {
      setMatchmakingMessage("Matching skills & experience...");
      setTimeout(() => {
        setMatches([
          { id: 1, name: "Aster T.", age: 24, experience: "5 years experience", location: "Addis Ababa", match: 98, verified: true, skills: ["Cleaning", "Cooking", "Childcare"], image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop" },
          { id: 2, name: "Mekdes A.", age: 27, experience: "3 years experience", location: "Addis Ababa", match: 92, verified: true, skills: ["Cleaning", "Laundry"], image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" },
          { id: 3, name: "Helen B.", age: 22, experience: "2 years experience", location: "Bahir Dar", match: 85, verified: false, skills: ["Cooking", "Elderly Care"], image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop" }
        ]);
        setIsLoadingMatches(false);
      }, 1500);
    }, 1000);
  };

  const roleConfig = {
    helper: { icon: Home, gradient: "from-emerald-500 to-emerald-600", color: "emerald", shadow: "shadow-emerald-500/20" },
    employer: { icon: Briefcase, gradient: "from-teal-500 to-teal-600", color: "teal", shadow: "shadow-teal-500/20" },
    agent: { icon: Users, gradient: "from-cyan-500 to-cyan-600", color: "cyan", shadow: "shadow-cyan-500/20" }
  };

  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors group">
          <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
          <span>{t("registration.backToRoles")}</span>
        </button>
        <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${config.gradient} rounded-2xl mb-5 shadow-lg ${config.shadow}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">{t(`registration.${role}.title`)}</h2>
        <p className="text-slate-400 text-lg">{t(`registration.${role}.subtitle`)}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-10">
        {Array.from({ length: currentMaxStep }, (_, i) => i + 1).map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${step >= s ? `bg-gradient-to-br ${config.gradient} text-white` : "bg-slate-800 text-slate-500"}`}>
              {step > s ? <CheckCircle className="w-4 h-4" /> : s}
            </div>
            {s < currentMaxStep && <div className={`w-12 h-0.5 ${step > s ? "bg-teal-500" : "bg-slate-800"}`} />}
          </div>
        ))}
      </div>

      <div className="glass-card-solid rounded-2xl p-8 shadow-2xl">
        {showSuccessCard ? (
          <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <Sparkles className={`w-16 h-16 text-${config.color}-500 mx-auto`} />
            <h2 className="text-2xl font-bold text-white">Profile Certified!</h2>
            <p className="text-slate-400">Your professional identity has been verified through our AI engine.</p>
            <div className="p-6 bg-slate-800/50 rounded-xl border border-dashed border-slate-700 text-left">
               <div className="flex items-center gap-4 text-white">
                  <FileText className={`w-10 h-10 text-${config.color}-400`} />
                  <div>
                    <p className="font-medium">SmartHire_Badge.pdf</p>
                    <p className="text-xs text-slate-500 uppercase tracking-tighter">Verified Fayda ID Authenticated</p>
                  </div>
               </div>
               <Button onClick={() => alert("Downloading SmartHire Certification...")} className={`w-full mt-6 bg-${config.color}-500 hover:bg-${config.color}-600 text-white rounded-xl border-0 font-bold h-12 shadow-lg`}>
                  Download Trust Badge Now
               </Button>
            </div>
            <button onClick={onBack} className="text-slate-500 hover:text-white transition-colors text-sm font-medium flex items-center gap-2 mx-auto">
              <ArrowRight className="w-4 h-4 rotate-180" /> Back to Home
            </button>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errorMsg && <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm overflow-hidden text-ellipsis whitespace-nowrap">{errorMsg}</div>}
            
            {step === 1 && (
              <div className="space-y-5">
                {/* Profile Photo Upload */}
                <div className="flex flex-col items-center gap-4 mb-6">
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="relative w-24 h-24 rounded-full bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center cursor-pointer group hover:border-teal-500 transition-colors overflow-hidden"
                  >
                    {photoPreview ? (
                      <img src={photoPreview} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <Camera className="w-8 h-8 text-slate-500 group-hover:text-teal-500 transition-colors" />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-[10px] text-white font-bold uppercase">Change</span>
                    </div>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                  <p className="text-xs text-slate-500 font-medium">Upload Professional Profile Photo</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-slate-300">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"/>
                      <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ethiopian Passport Standard" className="pl-10 bg-slate-800/50 border-slate-700 text-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"/>
                      <Input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+251-XXX-XXXX" className="pl-10 bg-slate-800/50 border-slate-700 text-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Age</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"/>
                      <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} required placeholder="Years" className="pl-10 bg-slate-800/50 border-slate-700 text-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Gender</label>
                    <div className="flex gap-2">
                      {["male", "female"].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGender(g)}
                          className={`flex-1 h-10 rounded-lg border text-sm font-medium transition-all ${gender === g ? "bg-teal-500/20 border-teal-500 text-teal-400" : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600"}`}
                        >
                          {g.charAt(0).toUpperCase() + g.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Password</label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"/>
                      <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="pl-10 bg-slate-800/50 border-slate-700 text-white" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Region</label>
                    <select 
                      value={region} 
                      onChange={(e) => { setRegion(e.target.value); setCity(""); }}
                      className="w-full h-10 bg-slate-800/50 border border-slate-700 rounded-lg text-white px-3 text-sm outline-none focus:border-teal-500 transition-colors appearance-none"
                    >
                      <option value="">Select Region</option>
                      {Object.keys(ETHIOPIAN_REGIONS).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">City</label>
                    <select 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)}
                      disabled={!region}
                      className="w-full h-10 bg-slate-800/50 border border-slate-700 rounded-lg text-white px-3 text-sm outline-none focus:border-teal-500 transition-colors disabled:opacity-50 appearance-none"
                    >
                      <option value="">Select City</option>
                      {(ETHIOPIAN_REGIONS[region] || []).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
               <div className="space-y-4">
                  <div className="flex items-center gap-2 text-teal-400 mb-2"><Briefcase className="w-5 h-5"/> <h4 className="font-bold">Requirements / Skills Scan</h4></div>
                  <textarea className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-white focus:border-teal-500 transition-colors" rows={6} placeholder={role === "employer" ? "Detail your requirements..." : "List your skills, experience, and years of service..."} />
               </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="p-6 bg-slate-800/80 rounded-2xl border border-dashed border-teal-500/30 flex flex-col items-center gap-4 shadow-inner">
                  <BadgeCheck className="w-12 h-12 text-teal-400 animate-pulse" />
                  <p className="text-center text-slate-300 text-sm italic">Verification Engine: Authenticated via Ethiopian Ministry of Justice Gateway</p>
                </div>
                <Input value={faydaId} onChange={(e) => setFaydaId(e.target.value)} placeholder="12-digit National Fayda ID" className="bg-slate-800/50 border-slate-700 text-white text-center text-lg tracking-[0.2em] font-mono" />
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 w-5 h-5 border-slate-600 rounded bg-slate-800 text-teal-500" />
                  <span className="text-slate-400 text-sm group-hover:text-white transition-colors">By creating an account, I agree to SmartHire's trust and liability safety policies.</span>
                </label>
              </div>
            )}

            {step === 4 && role === "employer" && (
              <div className="space-y-4">
                {!matches && !isLoadingMatches && (
                  <Button type="button" onClick={handleFindMatches} className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 border-0 h-16 rounded-2xl font-bold text-xl shadow-xl hover:scale-[1.02] transition-transform">Run AI Match Scan</Button>
                )}
                {isLoadingMatches && (
                  <div className="flex flex-col items-center py-12 space-y-4 text-white">
                    <Loader2 className="w-16 h-16 text-teal-500 animate-spin" />
                    <p className="text-teal-400 animate-pulse font-bold text-lg">{matchmakingMessage}</p>
                  </div>
                )}
                {matches && (
                  <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar text-white animate-in slide-in-from-bottom-5">
                    {matches.map(match => (
                      <div key={match.id} className="p-5 bg-slate-800/80 border border-slate-700 rounded-2xl hover:border-teal-500 transition-all flex flex-col sm:flex-row gap-5 relative group">
                        <span className="absolute top-4 right-4 px-3 py-1 bg-teal-500/10 text-teal-400 text-xs font-bold rounded-full border border-teal-500/20">{match.match}% Correct Match</span>
                        <img src={match.image} className="w-20 h-20 rounded-2xl object-cover border border-slate-600 shadow-xl group-hover:scale-105 transition-transform" />
                        <div className="flex-1">
                          <h4 className="font-bold text-xl text-white mb-1">{match.name}</h4>
                          <p className="text-sm text-slate-500 mb-3 font-medium uppercase tracking-tighter">{match.experience} • {match.location}</p>
                          <div className="flex gap-2">
                             <Button type="button" onClick={() => alert("Building Contract...")} className="flex-1 bg-teal-500 hover:bg-teal-600 text-white border-0 h-12 rounded-xl text-sm font-bold shadow-teal-500/10 shadow-lg">Hire & Build Contract</Button>
                             <Button type="button" variant="outline" className="flex-1 border-slate-700 text-slate-400 hover:text-white h-12 rounded-xl text-sm bg-transparent">Profile</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4 pt-6">
              {step > 1 && <Button variant="ghost" type="button" onClick={() => setStep(step - 1)} className="flex-1 text-slate-400 h-14 hover:text-white">Back</Button>}
              {step < currentMaxStep ? (
                <Button type="button" onClick={() => setStep(step + 1)} disabled={step === 3 && !agreed} className={`flex-1 bg-gradient-to-br ${config.gradient} border-0 text-white h-14 rounded-2xl shadow-lg ring-offset-slate-900 focus:ring-2 focus:ring-teal-500 font-bold`}>Continue</Button>
              ) : (
                <Button type="submit" loading={isSubmitting} className={`flex-1 bg-gradient-to-br ${config.gradient} border-0 text-white h-14 rounded-2xl shadow-lg font-bold`}>{role === "employer" ? "Complete Registration" : "Enter Platform"}</Button>
              )}
            </div>
          </form>
        )}
      </div>

      <AIContractModal 
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        selectedParty={selectedMatch}
        employerName={name || "SmartHire Employer"}
      />
    </div>
  );
}

}