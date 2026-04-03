
import { useState } from "react";
import { useTranslation } from "@/lib/i18n-context";
import { Navbar } from "@/components/navbar";
import { Chatbot } from "@/components/chatbot";
import { RoleCard } from "@/components/role-card";
import { TrustSection } from "@/components/trust-section";
import { SignInModal } from "@/components/sign-in-modal";
import { RegistrationForm } from "@/components/registration-form";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home, Briefcase, Users, Shield, CheckCircle, BadgeCheck, Lock, Heart, FileCode } from "lucide-react";
import { AIContractModal } from "@/components/ai-contract-modal";




export default function SmartHireApp() {
  const [currentView, setCurrentView] = useState("home");
  const [showSignIn, setShowSignIn] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);

  const handleRoleSelect = (role) => {
    setCurrentView(`register-${role}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Deep Trust-focused Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      
      {/* Subtle Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[120px] animate-pulse-soft" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/6 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-800/50 rounded-full blur-[150px]" />
      </div>

      {/* Subtle Grid Pattern */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), 
                           linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      

      {/* Navigation */}
      <Navbar onSignInClick={() => setShowSignIn(true)} />

      {/* Main Content */}
      <main className="relative z-10 pt-28 pb-20 px-4">
        {currentView === "home" &&
        <>
            <HeroSection
            onGetStarted={() => setCurrentView("role-selection")}
            onHowItWorks={() => {
              document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
            }}
            onTestContract={() => setShowContractModal(true)} 
            />
          
            <div id="how-it-works">
              <HowItWorksSection onGetStarted={() => setCurrentView("role-selection")} />
            </div>
          </>
        }
        {currentView === "role-selection" &&
        <RoleSelectionSection
          onBack={() => setCurrentView("home")}
          onRoleSelect={handleRoleSelect} />

        }
        {currentView === "register-helper" &&
        <RegistrationForm
          role="helper"
          onBack={() => setCurrentView("role-selection")} />

        }
        {currentView === "register-employer" &&
        <RegistrationForm
          role="employer"
          onBack={() => setCurrentView("role-selection")} />

        }
        {currentView === "register-agent" &&
        <RegistrationForm
          role="agent"
          onBack={() => setCurrentView("role-selection")} />

        }
      </main>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
        onCreateAccount={() => {
          setShowSignIn(false);
          setCurrentView("role-selection");
        }} />
      

      {/* Chatbot */}
      <Chatbot />

      {/* AI Contract Modal */}
      <AIContractModal 
        isOpen={showContractModal} 
        onClose={() => setShowContractModal(false)}
        maidId={1}
        jobId={1}
        employerId={1}
        maidName="Abebech Kebede"
        employerName="Simret Abebe"
      />

      {/* Footer */}
      <Footer />
    </div>);

}

function HeroSection({ onGetStarted, onHowItWorks, onTestContract }) {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Content */}
      <div className="text-center mb-20">
        {/* Large Centered Logo */}
        <div className="mb-10 w-full flex justify-center">
          <img src="/logo.png" alt="SmartHire Logo" className="w-32 sm:w-40 md:w-48 lg:w-64 h-auto object-contain" />
        </div>

        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 glass-card px-5 py-2.5 rounded-full mb-10">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-white/80 text-sm font-medium">{t("hero.badge")}</span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight tracking-tight text-balance">
          <span className="block">{t("hero.titleLine1")}</span>
          <span className="block text-gradient-trust">{t("hero.titleLine2")}</span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed text-pretty">
          {t("hero.description")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            onClick={onGetStarted}
            className="trust-button text-lg px-10 py-7 rounded-xl border-0">
            
            {t("hero.getStarted")}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            variant="outline"
            onClick={onHowItWorks}
            className="secondary-button text-lg px-10 py-7 rounded-xl">
            
            {t("hero.watchHow")}
          </Button>
          <Button
            onClick={onTestContract}
            className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-lg px-10 py-7 rounded-xl"
          >
            <FileCode className="w-5 h-5 mr-2" />
            Test AI Contract
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>{t("hero.noCreditCard")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-500" />
            <span>{t("hero.dataSecure")}</span>
          </div>
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-emerald-500" />
            <span>{t("hero.faydaVerified")}</span>
          </div>
        </div>
      </div>

      {/* Trust Features */}
      <TrustSection />

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
        <FeatureCard
          icon={Shield}
          titleKey="features.identityVerified.title"
          descriptionKey="features.identityVerified.description"
          accent="emerald" />
        
        <FeatureCard
          icon={Heart}
          titleKey="features.communityTrusted.title"
          descriptionKey="features.communityTrusted.description"
          accent="teal" />
        
        <FeatureCard
          icon={Lock}
          titleKey="features.secureContracts.title"
          descriptionKey="features.secureContracts.description"
          accent="cyan" />
        
      </div>
    </div>);

}

function FeatureCard({ icon: Icon, titleKey, descriptionKey, accent




}) {
  const { t } = useTranslation();

  const accentColors = {
    emerald: "from-emerald-500 to-emerald-600 shadow-emerald-500/20",
    teal: "from-teal-500 to-teal-600 shadow-teal-500/20",
    cyan: "from-cyan-500 to-cyan-600 shadow-cyan-500/20"
  };

  return (
    <div className="glass-card-solid rounded-2xl p-8 group">
      <div className={`bg-gradient-to-br ${accentColors[accent]} p-3.5 rounded-xl w-fit mb-5 shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{t(titleKey)}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{t(descriptionKey)}</p>
    </div>);

}

function RoleSelectionSection({ onBack, onRoleSelect }) {
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-14">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors group">
          
          <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
          <span>{t("roleSelection.backToHome")}</span>
        </button>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight text-balance">
          {t("roleSelection.title")}
        </h2>
        <p className="text-slate-400 text-lg max-w-xl mx-auto text-pretty">
          {t("roleSelection.subtitle")}
        </p>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RoleCard
          icon={Home}
          titleKey="roleSelection.helper.title"
          subtitleKey="roleSelection.helper.subtitle"
          descriptionKey="roleSelection.helper.description"
          accent="emerald"
          onClick={() => onRoleSelect("helper")} />
        
        <RoleCard
          icon={Briefcase}
          titleKey="roleSelection.employer.title"
          subtitleKey="roleSelection.employer.subtitle"
          descriptionKey="roleSelection.employer.description"
          accent="teal"
          onClick={() => onRoleSelect("employer")} />
        
        <RoleCard
          icon={Users}
          titleKey="roleSelection.agent.title"
          subtitleKey="roleSelection.agent.subtitle"
          descriptionKey="roleSelection.agent.description"
          accent="cyan"
          onClick={() => onRoleSelect("agent")} />
        
      </div>

      {/* Trust Stats */}
      <div className="mt-20 glass-card-solid rounded-2xl p-10">
        <div className="text-center mb-8">
          <h3 className="text-white font-semibold text-lg mb-2">{t("stats.title")}</h3>
          <p className="text-slate-500 text-sm">{t("stats.subtitle")}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <TrustStat number="10,000+" labelKey="stats.verifiedUsers" icon={BadgeCheck} />
          <TrustStat number="5,000+" labelKey="stats.successfulMatches" icon={Heart} />
          <TrustStat number="98%" labelKey="stats.satisfactionRate" icon={CheckCircle} />
          <TrustStat number="24/7" labelKey="stats.aiSupport" icon={Shield} />
        </div>
      </div>
    </div>);

}

function TrustStat({ number, labelKey, icon: Icon }) {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <Icon className="w-5 h-5 text-emerald-500 mx-auto mb-3" />
      <div className="text-2xl md:text-3xl font-bold text-white mb-1">
        {number}
      </div>
      <div className="text-slate-500 text-sm">{t(labelKey)}</div>
    </div>);

}

function HowItWorksSection({ onGetStarted }) {
  const { t } = useTranslation();

  const steps = [
  {
    number: "01",
    titleKey: "howItWorks.step1.title",
    descriptionKey: "howItWorks.step1.description",
    icon: Users,
    accent: "emerald"
  },
  {
    number: "02",
    titleKey: "howItWorks.step2.title",
    descriptionKey: "howItWorks.step2.description",
    icon: BadgeCheck,
    accent: "teal"
  },
  {
    number: "03",
    titleKey: "howItWorks.step3.title",
    descriptionKey: "howItWorks.step3.description",
    icon: Heart,
    accent: "cyan"
  },
  {
    number: "04",
    titleKey: "howItWorks.step4.title",
    descriptionKey: "howItWorks.step4.description",
    icon: Shield,
    accent: "emerald"
  }];


  const accentColors = {
    emerald: "from-emerald-500 to-emerald-600 shadow-emerald-500/20",
    teal: "from-teal-500 to-teal-600 shadow-teal-500/20",
    cyan: "from-cyan-500 to-cyan-600 shadow-cyan-500/20"
  };

  return (
    <div className="max-w-5xl mx-auto py-20">
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 glass-card px-5 py-2.5 rounded-full mb-6">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-white/80 text-sm font-medium">{t("howItWorks.badge")}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight text-balance">
          {t("howItWorks.title")}
        </h2>
        <p className="text-slate-400 text-lg max-w-xl mx-auto text-pretty">
          {t("howItWorks.subtitle")}
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step, index) =>
        <div key={index} className="glass-card-solid rounded-2xl p-8 relative group hover:bg-slate-800/90 transition-all">
            {/* Step Number */}
            <div className="absolute top-6 right-6 text-5xl font-bold text-slate-800 group-hover:text-slate-700 transition-colors">
              {step.number}
            </div>
            
            {/* Icon */}
            <div className={`bg-gradient-to-br ${accentColors[step.accent]} p-3.5 rounded-xl w-fit mb-5 shadow-lg`}>
              <step.icon className="w-6 h-6 text-white" />
            </div>
            
            {/* Content */}
            <h3 className="text-xl font-semibold text-white mb-3">{t(step.titleKey)}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{t(step.descriptionKey)}</p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <Button
          onClick={onGetStarted}
          className="trust-button text-lg px-10 py-7 rounded-xl border-0">
          
          {t("howItWorks.cta")}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>);

}
