"use client";

import { useState } from "react";
import {
  Mic,
  BarChart3,
  Brain,
  Globe2,
  Sparkles,
  ChevronRight,
  Zap,
  TrendingUp,
  Database,
  MessageSquare,
  Radio,
  CheckCircle,
  ExternalLink,
  Calendar,
  Clock,
  Users,
  Video,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

interface Service {
  id: string;
  name: string;
  description: string;
  icon: any;
  features: string[];
  status: "active" | "beta" | "coming-soon";
  cta: string;
  href?: string;
  popular?: boolean;
}

const services: Service[] = [
  {
    id: "conversational-ai",
    name: "Conversational AI Studio",
    description: "Outbound Sales Representative with ultra-realistic voice AI. Natural conversations for lead qualification and sales automation.",
    icon: Mic,
    features: [
      "Outbound sales & lead qualification",
      "Ultra-low latency voice conversations (<200ms)",
      "Emotional intelligence & tone matching",
      "WebRTC & WebSocket streaming",
      "Client-side tools & contextual updates",
      "Multi-language support (30+ languages)",
    ],
    status: "active",
    cta: "Launch Studio",
    href: "/business/services/conversational-ai",
    popular: true,
  },
  {
    id: "analytics-hub",
    name: "Agent Analytics Hub",
    description: "Deep insights into agent performance, user engagement, and revenue metrics. Real-time dashboards with predictive analytics.",
    icon: BarChart3,
    features: [
      "Real-time conversation analytics",
      "User sentiment analysis",
      "Revenue attribution tracking",
      "Predictive usage forecasting",
      "Custom KPI dashboards",
      "Export & API access",
    ],
    status: "active",
    cta: "View Analytics",
    href: "/business/services/analytics",
  },
  {
    id: "training-suite",
    name: "Enterprise Training Suite",
    description: "Fine-tune agents on your proprietary data. Upload documents, train custom models, and deploy domain-specific AI.",
    icon: Brain,
    features: [
      "Custom model fine-tuning",
      "Document ingestion pipeline",
      "RAG (Retrieval Augmented Generation)",
      "Knowledge base versioning",
      "Continuous learning loops",
      "Data privacy controls",
    ],
    status: "beta",
    cta: "Start Training",
    href: "/business/services/training",
  },
  {
    id: "omnichannel",
    name: "Omnichannel Deployment",
    description: "Deploy agents across 15+ platforms. Web, mobile, WhatsApp, Telegram, Slack, Discord, and custom integrations.",
    icon: Globe2,
    features: [
      "One-click platform deployment",
      "WhatsApp Business API integration",
      "Telegram bot deployment",
      "Slack & Discord bots",
      "Custom webhook integrations",
      "Unified conversation history",
    ],
    status: "active",
    cta: "Configure Channels",
    href: "/business/services/omnichannel",
  },
];

export default function AdvitLabsServices() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-white border border-black/10 p-12 lg:p-16">
        <div className="absolute inset-0 bg-architect-grid opacity-[0.4] pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-black border border-black rounded-none">
              <img
                src="/advit-labs-logo.png"
                alt="ADVIT AI Labs"
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h2 className="font-logo font-black text-4xl text-black tracking-tight">
                  ADVIT<span className="text-sm align-super font-sans font-normal ml-1">™</span> AI Labs
                </h2>
              </div>
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-black/40">
                [ AutomatonAI Enterprise Infrastructure ]
              </div>
            </div>
          </div>
          <p className="text-black/60 text-lg max-w-2xl leading-relaxed font-sans font-medium">
            Premium services designed for businesses building the next generation of AI experiences.
            Production-ready, enterprise-grade, infinite scale.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {services.map((service) => {
          const Icon = service.icon;
          const isSelected = selectedService === service.id;

          return (
            <div
              key={service.id}
              className={`group relative bg-white border transition-all duration-500 cursor-pointer ${
                isSelected ? "border-black shadow-2xl scale-[1.01] z-10" : "border-black/10 hover:border-black/30"
              }`}
              onClick={() => setSelectedService(isSelected ? null : service.id)}
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute top-6 right-6 z-10">
                  <div className="flex items-center gap-1.5 bg-black text-white px-3 py-1.5">
                    <Zap className="w-3 h-3 text-[#FF4500]" />
                    <span className="font-mono text-[9px] uppercase tracking-widest font-bold">Popular</span>
                  </div>
                </div>
              )}

              <div className="p-8 relative z-10">
                {/* Icon & Status */}
                <div className="flex items-start justify-between mb-8">
                  <div className="w-12 h-12 bg-black/5 flex items-center justify-center border border-black/10">
                    <Icon className="w-5 h-5 text-black" />
                  </div>
                  
                  <div className="flex items-center gap-2 border border-black/10 px-3 py-1 bg-white">
                    {service.status === "active" && <Radio className="w-3 h-3 text-[#FF4500] animate-pulse" />}
                    <span className="font-mono text-[9px] uppercase tracking-widest text-black/60">
                      {service.status === "active" ? "Live Node" : service.status === "beta" ? "Beta Phase" : "Pending"}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="font-sans font-bold text-2xl mb-4 tracking-tight text-black">
                  {service.name}
                </h3>
                <p className="text-black/60 mb-8 leading-relaxed text-sm">{service.description}</p>

                {/* Features List */}
                <div
                  className={`space-y-3 transition-all duration-500 ${
                    isSelected ? "max-h-96 opacity-100 mb-8" : "max-h-0 opacity-0 overflow-hidden mb-0"
                  }`}
                >
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-1 h-1 bg-[#FF4500] rounded-none mt-2 flex-shrink-0" />
                      <span className="text-sm font-medium text-black/70">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="flex gap-3">
                  {service.status !== "coming-soon" ? (
                    <>
                      <Link href={service.href || "#"} className="flex-1">
                        <button
                          className="w-full flex items-center justify-between gap-4 bg-black text-white px-6 py-4 border border-black hover:bg-[#FF4500] hover:border-[#FF4500] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        >
                          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">{service.cta}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                      <button
                        className="flex items-center justify-center w-14 h-14 bg-white border border-black/10 hover:border-black hover:bg-black/5 transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://docs.advitlabs.ai/${service.id}`, "_blank");
                        }}
                      >
                        <ExternalLink className="w-4 h-4 text-black" />
                      </button>
                    </>
                  ) : (
                    <button className="w-full flex items-center justify-center bg-black/5 text-black/40 px-6 py-4 border border-black/10 cursor-not-allowed font-mono text-[10px] uppercase tracking-[0.2em]">
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-black/10 bg-white">
        {[
          { icon: TrendingUp, val: "99.9%", label: "Uptime SLA", accent: "text-[#FF4500]" },
          { icon: Zap, val: "<200ms", label: "Avg Response", accent: "text-black" },
          { icon: Database, val: "1M+", label: "Calls/Day", accent: "text-black" },
          { icon: MessageSquare, val: "30+", label: "Languages", accent: "text-black" }
        ].map((stat, i) => (
          <div key={i} className={`p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-black/10 last:border-0 relative overflow-hidden group`}>
            <stat.icon className={`w-5 h-5 mb-4 ${stat.accent} opacity-40 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className="font-sans font-black text-3xl tracking-tight text-black mb-2">{stat.val}</div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-black/40">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Enterprise Support & Consultation */}
      <div className="bg-white border border-black/10 overflow-hidden relative">
        <div className="absolute inset-0 bg-architect-grid opacity-[0.2] pointer-events-none" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 relative z-10">
          {/* Left: Info */}
          <div className="p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-black/10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-black flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-2xl text-black">Enterprise Consult</h3>
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#FF4500] mt-1">Free Strategy Session</div>
              </div>
            </div>

            <p className="text-black/60 text-sm mb-10 leading-relaxed font-medium">
              Talk to our AI infrastructure experts. Get personalized recommendations for scaling
              your agents, optimizing performance, and implementing enterprise features.
            </p>

            <div className="space-y-4 mb-10">
              {[
                { icon: Clock, text: "30-MINUTE DEEP DIVE" },
                { icon: Users, text: "DEDICATED SOLUTIONS ARCHITECT" },
                { icon: Video, text: "SCREEN SHARING & DEMOS" },
                { icon: Sparkles, text: "CUSTOM ROADMAP" },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-4">
                    <Icon className="w-4 h-4 text-black/40" />
                    <span className="font-mono text-[10px] tracking-widest text-black/80">{item.text}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="border border-black/10 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.2em] text-black/40">No Credit Card</div>
              <div className="border border-black/10 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.2em] text-black/40">100% Free</div>
              <div className="border border-black/10 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.2em] text-black/40">Zero Pressure</div>
            </div>
          </div>

          {/* Right: Cal.com Embed */}
          <div className="p-0 bg-black/[0.02] flex items-center justify-center relative">
            <div className="w-full h-full min-h-[500px] relative">
              <iframe
                src="https://cal.com/advit-ai-labs/30min?embed=true&theme=light"
                className="w-full h-full border-0"
                style={{ minHeight: '500px' }}
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
