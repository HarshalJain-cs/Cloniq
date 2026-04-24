"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useActiveAccount } from "thirdweb/react";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/lib/thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Brain, Cpu, Database, Fingerprint, Rocket, ArrowRight, ArrowLeft, Loader2, Globe, Plus, X, Upload, FileText, Wallet, AlertCircle, Twitter, CheckCircle, Smile, Frown, Lightbulb, Heart, MessageCircle, Download } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { MODEL_REGISTRY, type LLMProvider } from "@/lib/llm-provider";

const STEPS = [
  { id: "identity", title: "Identity", description: "Define your agent's persona", icon: Fingerprint },
  { id: "logic", title: "Logic", description: "Configure neural parameters", icon: Brain },
  { id: "knowledge", title: "Knowledge", description: "Upload RAG datasets", icon: Database },
  { id: "launch", title: "Launch", description: "Deploy to Cloniq", icon: Rocket },
];

function WalletGate() {
  const wallets = [
    inAppWallet({
      auth: { options: ["google", "email", "apple"] },
      smartAccount: { chain: baseSepolia, sponsorGas: true },
    }),
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <Wallet size={32} />
        </div>
        <div>
          <h2 className="font-outfit font-black text-3xl tracking-tight text-foreground mb-3">
            Connect to Deploy
          </h2>
          <p className="text-foreground/50 font-medium max-w-sm">
            Your wallet is your identity on Cloniq. Connect once — we'll create your account automatically and link any agents you deploy to your address.
          </p>
        </div>
        <ConnectButton
          client={client}
          chain={baseSepolia}
          wallets={wallets}
          theme="light"
          connectButton={{
            label: "Connect Wallet",
            className: "!rounded-full !px-8 !py-3 !h-auto !text-sm !font-bold",
          }}
          accountAbstraction={{ chain: baseSepolia, sponsorGas: true }}
        />
        <p className="text-xs text-foreground/30">
          Supports Google, email, MetaMask, and Coinbase Wallet
        </p>
      </motion.div>
    </div>
  );
}

export default function CreateAgentWizard() {
  const router = useRouter();
  const account = useActiveAccount();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [validationWarnings, setValidationWarnings] = useState<{
    name?: string;
    description?: string;
  }>({});
  const [twitterPersonality, setTwitterPersonality] = useState<string | null>(null);
  const [isScrapingTwitter, setIsScrapingTwitter] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ensName: "",
    skillTags: [] as string[],
    priceUsdc: 0,
    isInitiallyFree: true,
    initialMemory: "",
    llmProvider: "groq" as LLMProvider, // Default provider
    llmModel: "llama-3.3-70b-versatile", // Default Groq model
    openaiApiKey: "",
    anthropicApiKey: "",
    twitterUsername: "",
    importTwitterPersonality: false,
    // 5 Mood/Emotion Questions
    moodExcited: "",
    moodFrustrated: "",
    moodThoughtful: "",
    moodHelpful: "",
    moodCasual: "",
  });

  const nextStep = () => currentStep < STEPS.length - 1 && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);

  const validateField = (fieldName: string, value: string) => {
    const warnings: Record<string, string> = {};

    if (fieldName === "name") {
      if (value.length === 0) {
        warnings.name = "Agent name is required";
      } else if (value.length < 3) {
        warnings.name = "Agent name must be at least 3 characters";
      } else if (!/^[a-z0-9-]+$/.test(value)) {
        warnings.name = "Only lowercase letters, numbers, and hyphens allowed";
      }
    }

    if (fieldName === "description") {
      if (value.length > 0 && value.length < 20) {
        warnings.description = "Description should be at least 20 characters for better clarity";
      }
    }

    return warnings;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Real-time validation
    const fieldWarnings = validateField(name, value);
    setValidationWarnings(prev => ({
      ...prev,
      ...fieldWarnings,
      ...(Object.keys(fieldWarnings).length === 0 ? { [name]: undefined } : {})
    }));
  };

  const handleToggleFree = () => {
    setFormData(prev => ({ ...prev, isInitiallyFree: !prev.isInitiallyFree }));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !formData.skillTags.includes(t)) {
      setFormData(prev => ({ ...prev, skillTags: [...prev.skillTags, t] }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, skillTags: prev.skillTags.filter(t => t !== tag) }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".md")) { setError("Only .md files accepted"); return; }
    if (file.size > 10 * 1024 * 1024) { setError("File must be under 10 MB"); return; }
    setError(null);
    setUploadedFile(file);
    file.text().then(text => setFormData(prev => ({ ...prev, initialMemory: text })));
  };

  const handleTwitterScrape = async () => {
    if (!formData.twitterUsername) return;

    setIsScrapingTwitter(true);
    setError(null);

    try {
      const response = await fetch("/api/twitter/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: formData.twitterUsername }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to scrape Twitter profile");
      }

      setTwitterPersonality(result.data.personality_summary);
      setError(null);
    } catch (err: any) {
      setError(`Twitter scraping failed: ${err.message}`);
      setTwitterPersonality(null);
    } finally {
      setIsScrapingTwitter(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    // If Twitter personality import is enabled, scrape first
    if (formData.importTwitterPersonality && formData.twitterUsername && !twitterPersonality) {
      await handleTwitterScrape();
    }

    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ownerWallet: account?.address ?? null,
          twitterPersonality: twitterPersonality || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create agent");
      }

      router.push(`/agent/${result.agent.id}`);
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  if (!account) return <WalletGate />;

  return (
    <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
      {/* Wizard Header */}
      <div className="mb-12 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
          <Badge variant="accent" className="px-4 py-1">New Agent</Badge>
        </div>
        <h1 className="font-outfit font-black text-5xl tracking-tight text-foreground mb-4">
          Birth of a <span className="text-primary italic">Soul.</span>
        </h1>
        <p className="text-foreground/60 font-medium">
          Follow the steps to configure and deploy your autonomous intelligence.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-4 mb-12">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex-1 flex flex-col gap-2">
            <div className={`h-1 rounded-full transition-all duration-500 ${index <= currentStep ? "bg-primary" : "bg-black/5"}`} />
            <span className={`text-[10px] font-bold uppercase tracking-widest hidden md:block ${index === currentStep ? "text-primary" : "text-foreground/30"}`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="glass shadow-premium border-black/5 overflow-hidden">
        <CardContent className="p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="min-h-[350px]"
            >
              {currentStep === 0 && (
                <div className="flex flex-col gap-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Fingerprint size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">Identity Definition</h3>
                      <p className="text-sm text-foreground/60">Choose a name and description for your agent handles.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-foreground/40">Agent Handle (Unique)</label>
                      <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. strategy-core"
                        className={cn(
                          "bg-white/50 border px-4 py-3 rounded-xl text-sm focus:outline-none transition-all font-medium",
                          validationWarnings.name
                            ? "border-amber-400 focus:border-amber-500"
                            : "border-black/5 focus:border-primary/30"
                        )}
                      />
                      {validationWarnings.name ? (
                        <div className="flex items-center gap-1.5 text-amber-600">
                          <AlertCircle size={12} />
                          <p className="text-[10px] font-medium">{validationWarnings.name}</p>
                        </div>
                      ) : (
                        <p className="text-[10px] text-foreground/40">Lowercase, alphanumeric and hyphens only.</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-foreground/40">ENS / Basename (Optional)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 font-bold">
                          <Globe size={14} />
                        </span>
                        <input 
                          name="ensName"
                          type="text" 
                          value={formData.ensName}
                          onChange={handleChange}
                          placeholder="vitalik.eth"
                          className="w-full bg-white/50 border border-black/5 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary/30 transition-all font-medium"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-foreground/40">Bio / Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="An agent specialized in DeFi strategy and risk assessment..."
                        rows={3}
                        className={cn(
                          "bg-white/50 border px-4 py-3 rounded-xl text-sm focus:outline-none transition-all font-medium resize-none",
                          validationWarnings.description
                            ? "border-amber-400 focus:border-amber-500"
                            : "border-black/5 focus:border-primary/30"
                        )}
                      />
                      {validationWarnings.description && (
                        <div className="flex items-center gap-1.5 text-amber-600">
                          <AlertCircle size={12} />
                          <p className="text-[10px] font-medium">{validationWarnings.description}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-foreground/40">Skill Tags</label>
                      <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                        {formData.skillTags.map(tag => (
                          <span key={tag} className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)}><X className="w-3 h-3" /></button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          value={tagInput}
                          onChange={e => setTagInput(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
                          placeholder="DeFi, Security, Research…"
                          className="flex-1 bg-white/50 border border-black/5 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary/30 transition-all font-medium"
                        />
                        <Button type="button" variant="outline" size="sm" onClick={addTag} className="shrink-0">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-[10px] text-foreground/40">Press Enter or click + to add. These help users discover your agent.</p>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="flex flex-col gap-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Brain size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">Logic & Pricing</h3>
                      <p className="text-sm text-foreground/60">Configure access levels and revenue model.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {/* Provider Selection */}
                    <div className="flex flex-col gap-3">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-foreground/40">LLM Provider</label>
                      <div className="grid grid-cols-3 gap-3">
                        {(["groq", "openai", "anthropic"] as LLMProvider[]).map((provider) => (
                          <button
                            key={provider}
                            type="button"
                            onClick={() => {
                              const defaultModel = MODEL_REGISTRY[provider][0]?.id || "";
                              setFormData(prev => ({ ...prev, llmProvider: provider, llmModel: defaultModel }));
                            }}
                            className={`px-4 py-3 rounded-xl font-medium text-sm transition-all capitalize ${
                              formData.llmProvider === provider
                                ? "bg-primary text-white shadow-lg"
                                : "bg-white/50 border border-black/10 hover:border-primary/30"
                            }`}
                          >
                            {provider === "groq" && "Groq"}
                            {provider === "openai" && "OpenAI"}
                            {provider === "anthropic" && "Anthropic"}
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-foreground/40">Choose your preferred AI provider for this agent.</p>
                    </div>

                    {/* Model Selection */}
                    <div className="flex flex-col gap-3">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-foreground/40">Model</label>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
                          <Cpu size={20} className="text-primary" />
                        </div>
                        <select
                          value={formData.llmModel}
                          onChange={(e) => setFormData(prev => ({ ...prev, llmModel: e.target.value }))}
                          className="flex-1 bg-white border border-black/10 px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-primary/30 transition-all cursor-pointer"
                        >
                          {MODEL_REGISTRY[formData.llmProvider].map((model) => (
                            <option key={model.id} value={model.id}>
                              {model.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <p className="text-[10px] text-foreground/40">
                        {MODEL_REGISTRY[formData.llmProvider].find(m => m.id === formData.llmModel)?.description || "Select a model"}
                      </p>
                    </div>

                    {/* API Key Input for OpenAI */}
                    {formData.llmProvider === "openai" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-2"
                      >
                        <label className="text-[10px] uppercase font-bold tracking-widest text-foreground/40">
                          OpenAI API Key *
                        </label>
                        <input
                          type="password"
                          name="openaiApiKey"
                          value={formData.openaiApiKey}
                          onChange={handleChange}
                          placeholder="sk-proj-..."
                          className="bg-white/50 border border-black/5 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary/30 transition-all font-mono"
                        />
                        <p className="text-[10px] text-foreground/40">
                          Your OpenAI API key will be used for this agent's queries. Get it from{" "}
                          <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                            platform.openai.com
                          </a>
                        </p>
                      </motion.div>
                    )}

                    {/* API Key Input for Anthropic */}
                    {formData.llmProvider === "anthropic" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-2"
                      >
                        <label className="text-[10px] uppercase font-bold tracking-widest text-foreground/40">
                          Anthropic API Key *
                        </label>
                        <input
                          type="password"
                          name="anthropicApiKey"
                          value={formData.anthropicApiKey}
                          onChange={handleChange}
                          placeholder="sk-ant-..."
                          className="bg-white/50 border border-black/5 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary/30 transition-all font-mono"
                        />
                        <p className="text-[10px] text-foreground/40">
                          Your Anthropic API key will be used for this agent's queries. Get it from{" "}
                          <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                            console.anthropic.com
                          </a>
                        </p>
                      </motion.div>
                    )}

                    <div 
                      className={`p-6 rounded-2xl border transition-all cursor-pointer ${formData.isInitiallyFree ? "bg-primary/5 border-primary/20" : "bg-white/50 border-black/5"}`}
                      onClick={handleToggleFree}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-sm">Free to Query</h4>
                        <div className={`w-10 h-5 rounded-full relative transition-colors ${formData.isInitiallyFree ? "bg-primary" : "bg-foreground/10"}`}>
                           <div className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all ${formData.isInitiallyFree ? "right-1" : "left-1"}`} />
                        </div>
                      </div>
                      <p className="text-[11px] text-foreground/50">Public access. No payment required for interactions.</p>
                    </div>

                    {!formData.isInitiallyFree && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-2"
                      >
                         <label className="text-[10px] uppercase font-bold tracking-widest text-foreground/40">Price per Query (USDC)</label>
                         <input 
                           name="priceUsdc"
                           type="number" 
                           step="0.01"
                           value={formData.priceUsdc}
                           onChange={(e) => setFormData(prev => ({ ...prev, priceUsdc: parseFloat(e.target.value) }))}
                           placeholder="0.05"
                           className="bg-white/50 border border-black/5 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary/30 transition-all font-medium"
                         />
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
              
              {currentStep === 2 && (
                <div className="flex flex-col gap-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Database size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">Knowledge Base</h3>
                      <p className="text-sm text-foreground/60">Seed your agent with initial RAG context or import personality from Twitter/X.</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* Twitter Personality Import */}
                    <div className="p-5 border-2 border-sky-500/20 rounded-2xl bg-gradient-to-br from-sky-50 to-white">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                              <Twitter className="w-5 h-5 text-sky-500" />
                            </div>
                            <div>
                              <label className="text-sm font-bold text-foreground">
                                Import Personality from Twitter/X
                              </label>
                              <p className="text-[10px] text-foreground/50">Analyze your tweets to clone your writing style</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, importTwitterPersonality: !prev.importTwitterPersonality }))}
                            className={`w-11 h-6 rounded-full relative transition-colors ${
                              formData.importTwitterPersonality ? "bg-sky-500" : "bg-foreground/10"
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-sm ${
                              formData.importTwitterPersonality ? "right-1" : "left-1"
                            }`} />
                          </button>
                        </div>

                        {formData.importTwitterPersonality && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="flex flex-col gap-3 pt-3 border-t border-sky-200"
                          >
                            <div className="flex gap-2">
                              <div className="flex items-center gap-2 flex-1">
                                <span className="text-foreground/40 font-bold text-base">@</span>
                                <input
                                  name="twitterUsername"
                                  type="text"
                                  value={formData.twitterUsername}
                                  onChange={handleChange}
                                  placeholder="your_twitter_username"
                                  className="flex-1 bg-white border-2 border-sky-500/30 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-sky-500 transition-all font-medium"
                                />
                              </div>
                              <Button
                                type="button"
                                onClick={handleTwitterScrape}
                                disabled={!formData.twitterUsername || isScrapingTwitter}
                                className="shrink-0 bg-sky-500 hover:bg-sky-600 text-white px-6"
                              >
                                {isScrapingTwitter ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Analyzing...
                                  </>
                                ) : (
                                  <>
                                    <Twitter className="w-4 h-4 mr-2" />
                                    Analyze
                                  </>
                                )}
                              </Button>
                            </div>

                            {twitterPersonality && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-green-50 border-2 border-green-300 rounded-xl"
                              >
                                <div className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                  <div>
                                    <p className="text-xs font-bold text-green-800 mb-1">Personality Extracted Successfully!</p>
                                    <p className="text-xs text-green-700 leading-relaxed">{twitterPersonality}</p>
                                  </div>
                                </div>
                              </motion.div>
                            )}

                            {!twitterPersonality && (
                              <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl">
                                <p className="text-xs text-sky-700 leading-relaxed">
                                  💡 <strong>How it works:</strong> We'll fetch your recent tweets and analyze your communication style, tone, topics, and personality traits using AI. This creates an agent that truly sounds like you!
                                </p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-foreground/30">
                      <div className="flex-1 h-px bg-black/5" />
                      <span className="text-[10px] uppercase font-bold tracking-widest">personality questions</span>
                      <div className="flex-1 h-px bg-black/5" />
                    </div>

                    {/* 5 Mood/Emotion Questions */}
                    <div className="p-6 border-2 border-purple-500/20 rounded-2xl bg-gradient-to-br from-purple-50 to-white">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                          <Heart className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-foreground">Emotional Personality Capture</h4>
                          <p className="text-[10px] text-foreground/50">Help us clone your exact communication style in different moods</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Question 1: Excited */}
                        <div>
                          <label className="flex items-center gap-2 text-xs font-bold text-foreground/70 mb-2">
                            <Smile className="w-4 h-4 text-green-500" />
                            When you're EXCITED about something, how do you express it?
                          </label>
                          <textarea
                            name="moodExcited"
                            value={formData.moodExcited}
                            onChange={handleChange}
                            placeholder="Example: 'YOOO this is insane! 🔥 Can't believe this is happening fr fr...'"
                            rows={2}
                            className="w-full bg-white border border-purple-500/20 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-purple-500/40 transition-all resize-none"
                          />
                        </div>

                        {/* Question 2: Frustrated */}
                        <div>
                          <label className="flex items-center gap-2 text-xs font-bold text-foreground/70 mb-2">
                            <Frown className="w-4 h-4 text-orange-500" />
                            When you're FRUSTRATED, how do you communicate?
                          </label>
                          <textarea
                            name="moodFrustrated"
                            value={formData.moodFrustrated}
                            onChange={handleChange}
                            placeholder="Example: 'Ugh this is so annoying. Why does it always break like this? 😤'"
                            rows={2}
                            className="w-full bg-white border border-purple-500/20 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-purple-500/40 transition-all resize-none"
                          />
                        </div>

                        {/* Question 3: Thoughtful/Analytical */}
                        <div>
                          <label className="flex items-center gap-2 text-xs font-bold text-foreground/70 mb-2">
                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                            When you're being THOUGHTFUL/ANALYTICAL, how do you sound?
                          </label>
                          <textarea
                            name="moodThoughtful"
                            value={formData.moodThoughtful}
                            onChange={handleChange}
                            placeholder="Example: 'Hmm, interesting. If we think about this from first principles...'"
                            rows={2}
                            className="w-full bg-white border border-purple-500/20 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-purple-500/40 transition-all resize-none"
                          />
                        </div>

                        {/* Question 4: Helpful/Teaching */}
                        <div>
                          <label className="flex items-center gap-2 text-xs font-bold text-foreground/70 mb-2">
                            <Heart className="w-4 h-4 text-pink-500" />
                            When you're HELPING/TEACHING someone, how do you talk?
                          </label>
                          <textarea
                            name="moodHelpful"
                            value={formData.moodHelpful}
                            onChange={handleChange}
                            placeholder="Example: 'No worries! Let me break this down for you step by step...'"
                            rows={2}
                            className="w-full bg-white border border-purple-500/20 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-purple-500/40 transition-all resize-none"
                          />
                        </div>

                        {/* Question 5: Casual/Relaxed */}
                        <div>
                          <label className="flex items-center gap-2 text-xs font-bold text-foreground/70 mb-2">
                            <MessageCircle className="w-4 h-4 text-blue-500" />
                            When you're just CHATTING CASUALLY, how do you sound?
                          </label>
                          <textarea
                            name="moodCasual"
                            value={formData.moodCasual}
                            onChange={handleChange}
                            placeholder="Example: 'lol yeah same here. what you been up to lately?'"
                            rows={2}
                            className="w-full bg-white border border-purple-500/20 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-purple-500/40 transition-all resize-none"
                          />
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-xl">
                        <p className="text-[10px] text-purple-700 leading-relaxed">
                          💡 <strong>Pro tip:</strong> Write exactly how YOU would say it - use your slang, emojis, punctuation style. The more authentic, the better your agent will sound like you!
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-foreground/30">
                      <div className="flex-1 h-px bg-black/5" />
                      <span className="text-[10px] uppercase font-bold tracking-widest">upload soul.md template</span>
                      <div className="flex-1 h-px bg-black/5" />
                    </div>

                    {/* Download Template Button */}
                    <a
                      href="/templates/soul.md"
                      download="soul-template.md"
                      className="flex items-center justify-center gap-2 p-4 border-2 border-primary/20 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all text-primary font-bold text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Download soul.md Template
                    </a>

                    {/* File Upload */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-foreground/40">Upload Your soul.md File (max 10 MB)</label>
                      <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${uploadedFile ? "border-primary/30 bg-primary/5" : "border-black/10 hover:border-primary/20 hover:bg-black/[0.02]"}`}>
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          {uploadedFile ? <FileText size={20} /> : <Upload size={20} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          {uploadedFile ? (
                            <>
                              <p className="text-sm font-bold text-foreground truncate">{uploadedFile.name}</p>
                              <p className="text-[11px] text-foreground/40">{(uploadedFile.size / 1024).toFixed(1)} KB — will be chunked and indexed</p>
                            </>
                          ) : (
                            <>
                              <p className="text-sm font-medium text-foreground/60">Drop a Markdown file here</p>
                              <p className="text-[11px] text-foreground/40">Documentation, notes, research — anything your agent should know</p>
                            </>
                          )}
                        </div>
                        {uploadedFile && (
                          <button type="button" onClick={(e) => { e.preventDefault(); setUploadedFile(null); setFormData(prev => ({ ...prev, initialMemory: "" })); }} className="text-foreground/30 hover:text-foreground/60 shrink-0">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <input type="file" accept=".md" className="hidden" onChange={handleFileSelect} />
                      </label>
                    </div>

                    <div className="flex items-center gap-3 text-foreground/30">
                      <div className="flex-1 h-px bg-black/5" />
                      <span className="text-[10px] uppercase font-bold tracking-widest">or paste text</span>
                      <div className="flex-1 h-px bg-black/5" />
                    </div>

                    <textarea
                      name="initialMemory"
                      value={uploadedFile ? "" : formData.initialMemory}
                      onChange={handleChange}
                      disabled={!!uploadedFile}
                      placeholder="Paste text or data your agent should know… This will be chunked and indexed in Supabase pgvector."
                      rows={6}
                      className="bg-white/50 border border-black/5 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary/30 transition-all font-medium resize-none shadow-inner disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                    <p className="text-[11px] text-foreground/40">
                      RAG allows your agent to retrieve private knowledge in real-time to answer queries accurately.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="flex flex-col items-center justify-center text-center py-6">
                   <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                     <Rocket size={40} className={isSubmitting ? "animate-bounce" : ""} />
                   </div>
                   <h3 className="font-bold text-2xl mb-2">Final Activation</h3>
                   <p className="text-foreground/60 max-w-xs mb-8">
                     Ready to launch <span className="text-primary font-bold">@{formData.name || "agent"}</span> to the network? 
                     This will create a dedicated Base Sepolia wallet for your agent.
                   </p>

                   <div className="w-full max-w-sm space-y-3">
                      <div className="flex justify-between text-xs p-3 rounded-xl bg-black/[0.02]">
                        <span className="text-foreground/40">Identity:</span>
                        <span className="font-bold text-foreground/70">@{formData.name}</span>
                      </div>
                      <div className="flex justify-between text-xs p-3 rounded-xl bg-black/[0.02]">
                        <span className="text-foreground/40">Pricing:</span>
                        <span className="font-bold text-foreground/70">{formData.isInitiallyFree ? "Free" : `$${formData.priceUsdc} USDC`}</span>
                      </div>
                      <div className="flex justify-between text-xs p-3 rounded-xl bg-black/[0.02]">
                        <span className="text-foreground/40">ENS:</span>
                        <span className="font-bold text-foreground/70">{formData.ensName || "Not set"}</span>
                      </div>
                   </div>

                   {error && <p className="mt-4 text-rose-500 text-xs font-bold">{error}</p>}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer Controls */}
          <div className="mt-12 flex items-center justify-between border-t border-black/5 pt-8">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={isSubmitting}
              className={currentStep === 0 ? "invisible" : ""}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            {currentStep === STEPS.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  !formData.name ||
                  (formData.llmProvider === "openai" && !formData.openaiApiKey) ||
                  (formData.llmProvider === "anthropic" && !formData.anthropicApiKey)
                }
                className="px-10 bg-primary hover:bg-primary/90 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    Activate Soul
                    <Rocket className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="px-10"
                disabled={
                  currentStep === 0 &&
                  (!formData.name || formData.name.length < 3 || !!validationWarnings.name)
                }
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
