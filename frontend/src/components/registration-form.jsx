
import { useState } from "react";
import { useTranslation } from "@/lib/i18n-context";
import { ArrowRight, Home, Briefcase, Users, BadgeCheck, Phone, Mail, MapPin, User, FileText, Building, Shield, CheckCircle, X, Search, Loader2, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIContractModal } from "./ai-contract-modal";






export function RegistrationForm({ role, onBack }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);
  const [matchmakingMessage, setMatchmakingMessage] = useState("");
  const [matches, setMatches] = useState(null);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const currentMaxStep = (role === "employer" || role === "agent") ? 4 : 3;

  // Data trackers for payload
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [faydaId, setFaydaId] = useState("");
  const [tinNumber, setTinNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Natively execute Django POST /api/register request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < currentMaxStep) return; // Prevent raw submission during Wizard navigation
    
    setIsSubmitting(true);
    setErrorMsg("");
    
    // Convert 'helper' strictly to backends 'maid' parameter
    const backendRole = role === "helper" ? "maid" : role;
    
    try {
        const payload = { name, phone, password, role: backendRole };
        if (faydaId) payload.fayda_id = faydaId;
        if (tinNumber) payload.tin_number = tinNumber;
        
        const res = await fetch("http://127.0.0.1:8000/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        
        const data = await res.json();
        if (!res.ok) {
            let errorText = data.error || "Registration error";
            if (data.errors) errorText = JSON.stringify(data.errors);
            throw new Error(errorText);
        }
        
        setIsSubmitting(false);
        alert(t("registration.success") || "Registration Verified & Successful! Please Log in.");
        onBack(); // Escapes back to main UI so they can Login
    } catch(err) {
        setIsSubmitting(false);
        setErrorMsg(err.message);
    }
  };

  const availableSkills = [
    { id: "cleaning", label: t("registration.skillCleaning") || "Cleaning & Housekeeping" },
    { id: "cooking", label: t("registration.skillCooking") || "Cooking & Culinary" },
    { id: "childcare", label: t("registration.skillChildcare") || "Childcare & Nanny" },
    { id: "elderly", label: t("registration.skillElderly") || "Elderly Care" },
    { id: "laundry", label: "Laundry & Ironing" },
    { id: "driving", label: t("registration.skillDriving") || "Driving" },
    { id: "gardening", label: t("registration.skillGardening") || "Gardening & Maintenance" }
  ];

  const handleSkillSelect = (e) => {
    const value = e.target.value;
    if (value && !selectedSkills.includes(value)) {
      setSelectedSkills([...selectedSkills, value]);
    }
    e.target.value = ""; // Reset basic select to show placeholder again
  };

  const removeSkill = (skillId) => {
    setSelectedSkills(selectedSkills.filter(id => id !== skillId));
  };

  const handleFindMatches = () => {
    setIsLoadingMatches(true);
    setMatchmakingMessage("Scanning 50+ nearby helpers...");
    
    setTimeout(() => {
      setMatchmakingMessage("Matching skills & experience...");
      setTimeout(() => {
        setMatchmakingMessage("Verifying candidate availability...");
        setTimeout(() => {
          setMatches([
            { id: 1, name: "Aster T.", age: 24, experience: "5 years experience", location: "Addis Ababa", match: 98, verified: true, skills: ["Cleaning", "Cooking", "Childcare"], image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop" },
            { id: 2, name: "Mekdes A.", age: 27, experience: "3 years experience", location: "Addis Ababa", match: 92, verified: true, skills: ["Cleaning", "Laundry"], image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" },
            { id: 3, name: "Helen B.", age: 22, experience: "2 years experience", location: "Bahir Dar", match: 85, verified: false, skills: ["Cooking", "Elderly Care"], image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop" }
          ]);
          setIsLoadingMatches(false);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setIsPhotoUploading(true);
      setTimeout(() => {
        setIsPhotoUploading(false);
      }, 2000);
    }
  };

  const handleStep3Click = () => {
    if (!agreed) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(step + 1);
    }, 2000);
  };

  const openContractModal = (match) => {
    setSelectedMatch(match);
    setIsContractModalOpen(true);
  };


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
        {Array.from({ length: currentMaxStep }, (_, i) => i + 1).map((s) =>
        <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
          step >= s ?
          `bg-gradient-to-br ${config.gradient} text-white` :
          "bg-slate-800 text-slate-500"}`
          }>
              {step > s ? <CheckCircle className="w-4 h-4" /> : s}
            </div>
            {s < currentMaxStep &&
          <div className={`w-12 h-0.5 ${step > s ? "bg-emerald-500" : "bg-slate-800"}`} />
          }
          </div>
        )}
      </div>

      {/* Form Card */}
      <div className="glass-card-solid rounded-2xl p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm whitespace-pre-wrap">
              {errorMsg}
            </div>
          )}
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
                  value={name} onChange={(e) => setName(e.target.value)} required
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
                  value={phone} onChange={(e) => setPhone(e.target.value)} required
                  placeholder={t("registration.phonePlaceholder")}
                  className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 h-12" />
                
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                  type="password"
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="Create a strong password"
                  className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 h-12" />
                </div>
              </div>

              {role === "helper" && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t("registration.age")}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                      type="number"
                      placeholder={t("registration.agePlaceholder")}
                      className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 h-12"
                    />
                  </div>
                </div>
              )}

              {role !== "helper" && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t("registration.email")}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                      type="email"
                      placeholder={t("registration.emailPlaceholder")}
                      className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 h-12" 
                    />
                  </div>
                </div>
              )}

              {role === "helper" && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t("registration.profilePhoto")}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handlePhotoUpload}
                        className="flex-1 pl-11 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20 transition-colors focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20" 
                      />
                      {isPhotoUploading && (
                        <div className="flex items-center gap-2 text-emerald-400 text-sm animate-pulse">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Uploading...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

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

              {role === "helper" ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {t("registration.primarySkills")}
                    </label>
                    <div className="space-y-3">
                      <select 
                        onChange={handleSkillSelect}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white appearance-none focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                        defaultValue=""
                      >
                        <option value="" disabled>{t("registration.primarySkillsPlaceholder")}</option>
                        {availableSkills.map(skill => (
                          <option key={skill.id} value={skill.id} disabled={selectedSkills.includes(skill.id)}>
                            {skill.label}
                          </option>
                        ))}
                      </select>
                      
                      {selectedSkills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedSkills.map(skillId => {
                            const skill = availableSkills.find(s => s.id === skillId);
                            return (
                              <span key={skillId} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-sm">
                                {skill?.label}
                                <button type="button" onClick={() => removeSkill(skillId)} className="hover:text-white transition-colors focus:outline-none">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {t("registration.contractPreference")}
                    </label>
                    <textarea
                      placeholder={t("registration.contractPreferencePlaceholder")}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {t("registration.paymentExpectation")}
                    </label>
                    <Input
                      type="text"
                      placeholder={t("registration.paymentExpectationPlaceholder")}
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 h-12"
                    />
                  </div>
                </div>
              ) : role === "employer" ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {t("registration.skillsRequired")}
                    </label>
                    <div className="space-y-3">
                      <select 
                        onChange={handleSkillSelect}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white appearance-none focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20"
                        defaultValue=""
                      >
                        <option value="" disabled>{t("registration.skillsRequiredPlaceholder")}</option>
                        {availableSkills.map(skill => (
                          <option key={skill.id} value={skill.id} disabled={selectedSkills.includes(skill.id)}>
                            {skill.label}
                          </option>
                        ))}
                      </select>
                      
                      {selectedSkills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedSkills.map(skillId => {
                            const skill = availableSkills.find(s => s.id === skillId);
                            return (
                              <span key={skillId} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-full text-sm">
                                {skill?.label}
                                <button type="button" onClick={() => removeSkill(skillId)} className="hover:text-white transition-colors focus:outline-none">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {t("registration.contractTerms")}
                    </label>
                    <textarea
                      placeholder={t("registration.contractTermsPlaceholder")}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {t("registration.paymentOffering")}
                    </label>
                    <Input
                      type="text"
                      placeholder={t("registration.paymentOfferingPlaceholder")}
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-teal-500/20 h-12"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t("registration.skills")}
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-4 w-5 h-5 text-slate-500" />
                    <textarea
                      placeholder={t("registration.skillsPlaceholder")}
                      rows={4}
                      className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 focus:outline-none resize-none" 
                    />
                  </div>
                </div>
              )}
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
                  value={faydaId} onChange={(e) => setFaydaId(e.target.value)}
                  placeholder={t("registration.faydaIdPlaceholder")}
                  className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 h-12" />
                
                </div>
              </div>

              {role === "agent" && (
                <div className="mt-6">
                  <div className="glass-card rounded-xl p-6 mb-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl shadow-lg shadow-cyan-500/20">
                        <Building className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-1">{t("registration.tinVerificationTitle")}</h4>
                        <p className="text-slate-400 text-sm">
                          {t("registration.tinVerificationDesc")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t("registration.tinNumber")}
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                      type="text"
                      value={tinNumber} onChange={(e) => setTinNumber(e.target.value)}
                      placeholder={t("registration.tinNumberPlaceholder")}
                      className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 h-12" 
                    />
                  </div>
                </div>
              )}

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

          {step === 4 && role === "employer" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Find Your Best Match</h3>
                <p className="text-slate-400">
                  Based on your preferences, SmartHire AI will match you with the most suitable workers.
                </p>
              </div>

              {!matches && !isLoadingMatches && (
                <div className="flex justify-center py-8">
                  <button
                    type="button"
                    onClick={handleFindMatches}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl hover:from-teal-400 hover:to-emerald-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 shadow-lg shadow-teal-500/25 transition-all transform hover:-translate-y-1"
                  >
                    <Search className="w-5 h-5" />
                    Find Matches
                  </button>
                </div>
              )}

              {isLoadingMatches && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="relative">
                    <Loader2 className="w-16 h-16 text-teal-500 animate-spin" />
                    <Sparkles className="w-6 h-6 text-teal-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="text-center">
                    <p className="text-teal-400 font-bold text-xl mb-1 animate-pulse">AI Agent Matching</p>
                    <p className="text-slate-400 h-6 transition-all duration-500">{matchmakingMessage}</p>
                  </div>
                </div>
              )}

              {matches && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {matches.map((match) => (
                    <div key={match.id} className="glass-card-solid p-5 rounded-xl border border-slate-700 hover:border-teal-500/50 transition-colors flex flex-col sm:flex-row gap-5 relative bg-slate-800/40 group/card">
                      <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                        <span className="inline-flex items-center justify-center px-3 py-1 bg-teal-500/10 text-teal-400 text-sm font-bold rounded-full border border-teal-500/20 shadow-[0_0_10px_rgba(20,184,166,0.2)]">
                          {match.match}% Match
                        </span>
                        {match.verified && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                            <BadgeCheck className="w-3.5 h-3.5" /> Verified
                          </span>
                        )}
                      </div>
                      
                      <div className="shrink-0 relative">
                        <img src={match.image} alt={match.name} className="w-20 h-20 rounded-xl object-cover border border-slate-600 shadow-md transition-transform group-hover/card:scale-105" />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between mt-2 sm:mt-0">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-lg font-bold text-white">{match.name}</h4>
                            <button
                              type="button"
                              onClick={() => openContractModal(match)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-500/30 rounded-md text-[10px] font-bold text-teal-400 hover:text-white hover:border-teal-400/50 transition-all uppercase tracking-wider"
                            >
                              <Sparkles className="w-2.5 h-2.5" />
                              Generate AI Contract
                            </button>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400 mb-3">
                            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {match.age} years old</span>
                            <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {match.experience}</span>
                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {match.location}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {match.skills.map((skill, index) => (
                              <span key={index} className="px-2.5 py-1 text-xs font-medium bg-slate-700/50 text-slate-300 rounded-md border border-slate-600">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 mt-auto">
                          <Button type="button" className="flex-1 bg-teal-500 hover:bg-teal-600 text-white border-0 shadow-lg shadow-teal-500/20">
                            Hire / Contact
                          </Button>
                          <Button type="button" variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 bg-transparent">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {matches.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      No matches found. Try adjusting your preferences.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 4 && role === "agent" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Helper Personal Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t("registration.fullName")}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                      type="text"
                      placeholder={t("registration.fullNamePlaceholder")}
                      className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 h-12" />
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
                      className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 h-12" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t("registration.age")}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                      type="number"
                      placeholder={t("registration.agePlaceholder")}
                      className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 h-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t("registration.profilePhoto")}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handlePhotoUpload}
                        className="flex-1 pl-11 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/10 file:text-cyan-500 hover:file:bg-cyan-500/20 transition-colors focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20" 
                      />
                      {isPhotoUploading && (
                        <div className="flex items-center gap-2 text-cyan-400 text-sm animate-pulse">
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                      )}
                    </div>
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
                      className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 h-12" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-4">Skills & Experience</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {t("registration.primarySkills")}
                    </label>
                    <div className="space-y-3">
                      <select 
                        onChange={handleSkillSelect}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white appearance-none focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20"
                        defaultValue=""
                      >
                        <option value="" disabled>{t("registration.primarySkillsPlaceholder")}</option>
                        {availableSkills.map(skill => (
                          <option key={skill.id} value={skill.id} disabled={selectedSkills.includes(skill.id)}>
                            {skill.label}
                          </option>
                        ))}
                      </select>
                      
                      {selectedSkills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedSkills.map(skillId => {
                            const skill = availableSkills.find(s => s.id === skillId);
                            return (
                              <span key={skillId} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-sm">
                                {skill?.label}
                                <button type="button" onClick={() => removeSkill(skillId)} className="hover:text-white transition-colors focus:outline-none">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {t("registration.contractPreference")}
                    </label>
                    <textarea
                      placeholder={t("registration.contractPreferencePlaceholder")}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {t("registration.paymentExpectation")}
                    </label>
                    <Input
                      type="text"
                      placeholder={t("registration.paymentExpectationPlaceholder")}
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 h-12"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

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
            
            {step < currentMaxStep ?
            <Button
              type="button"
              onClick={() => {
                if (step === 3) {
                  handleStep3Click();
                } else {
                  setStep(step + 1);
                }
              }}
              loading={step === 3 && isVerifying}
              disabled={(step === 3 && !agreed) || isVerifying}
              className="flex-1 trust-button py-6 rounded-xl border-0 disabled:opacity-50 disabled:cursor-not-allowed">
              
                {step === 3 && role === "employer" ? "Verify ID & Continue" : "Continue"}
                {!isVerifying && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button> :

            <Button
              type="submit"
              loading={isSubmitting}
              disabled={(step === 3 && !agreed) || isSubmitting}
              className="flex-1 trust-button py-6 rounded-xl border-0 disabled:opacity-50 disabled:cursor-not-allowed">
              
                {role === "employer" && step === 4 ? "Complete Verification" : t("registration.verifyId")}
                {!isSubmitting && (role === "employer" && step === 4 ? <CheckCircle className="w-5 h-5 ml-2" /> : <BadgeCheck className="w-5 h-5 ml-2" />)}
              </Button>
            }
          </div>
        </form>
      </div>

      {/* AI Contract Modal */}
      <AIContractModal 
        isOpen={isContractModalOpen} 
        onClose={() => setIsContractModalOpen(false)} 
        selectedParty={selectedMatch} 
      />
    </div>);

}