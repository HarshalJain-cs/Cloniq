"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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
} from "lucide-react";
import Link from "next/link";

interface Service {
  id: string;
  name: string;
  description: string;
  icon: any;
  gradient: string;
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
    gradient: "from-purple-500 via-pink-500 to-rose-500",
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
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
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
    gradient: "from-orange-500 via-red-500 to-pink-500",
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
    gradient: "from-green-500 via-emerald-500 to-teal-500",
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3F51B5] via-[#2C3E9E] to-[#1A237E] p-12 border border-white/10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-2xl blur-xl opacity-20 animate-pulse"></div>
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                <img
                  src="/advit-labs-logo.png"
                  alt="ADVIT AI Labs"
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-outfit font-black text-4xl text-white">
                  ADVIT<span className="text-xs align-super">™</span> AI Labs
                </h2>
              </div>
              <p className="text-white/70 text-sm font-medium">AutomatonAI Enterprise Infrastructure</p>
            </div>
          </div>
          <p className="text-white/80 text-lg max-w-3xl leading-relaxed">
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
            <Card
              key={service.id}
              className={`group relative overflow-hidden glass transition-all duration-500 hover:scale-[1.02] cursor-pointer ${
                isSelected ? "ring-2 ring-primary shadow-2xl" : "shadow-premium"
              }`}
              onClick={() => setSelectedService(isSelected ? null : service.id)}
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              ></div>

              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold border-0">
                    <Zap className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                </div>
              )}

              <CardContent className="p-8 relative z-10">
                {/* Icon & Status */}
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${service.gradient} rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity`}
                    ></div>
                    <div className="relative bg-background/80 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                      <Icon className="w-8 h-8" />
                    </div>
                  </div>
                  <Badge
                    variant={
                      service.status === "active"
                        ? "default"
                        : service.status === "beta"
                        ? "secondary"
                        : "outline"
                    }
                    className="text-xs"
                  >
                    {service.status === "active" && <Radio className="w-3 h-3 mr-1 animate-pulse" />}
                    {service.status === "active"
                      ? "Live"
                      : service.status === "beta"
                      ? "Beta"
                      : "Soon"}
                  </Badge>
                </div>

                {/* Title & Description */}
                <h3 className="font-bold text-2xl mb-3 group-hover:text-primary transition-colors">
                  {service.name}
                </h3>
                <p className="text-foreground/60 mb-6 leading-relaxed">{service.description}</p>

                {/* Features List */}
                <div
                  className={`space-y-2 mb-6 transition-all duration-500 ${
                    isSelected ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground/70">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="flex gap-3">
                  {service.status !== "coming-soon" ? (
                    <>
                      <Link href={service.href || "#"} className="flex-1">
                        <Button
                          className={`w-full bg-gradient-to-r ${service.gradient} hover:opacity-90 transition-opacity border-0`}
                        >
                          {service.cta}
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-white/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://docs.advitlabs.ai/${service.id}`, "_blank");
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      Coming Soon
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass border-white/5">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <div className="font-bold text-2xl">99.9%</div>
            <div className="text-xs text-foreground/60">Uptime SLA</div>
          </CardContent>
        </Card>
        <Card className="glass border-white/5">
          <CardContent className="p-6 text-center">
            <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
            <div className="font-bold text-2xl">&lt;200ms</div>
            <div className="text-xs text-foreground/60">Avg Response</div>
          </CardContent>
        </Card>
        <Card className="glass border-white/5">
          <CardContent className="p-6 text-center">
            <Database className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <div className="font-bold text-2xl">1M+</div>
            <div className="text-xs text-foreground/60">Conversations/day</div>
          </CardContent>
        </Card>
        <Card className="glass border-white/5">
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-6 h-6 mx-auto mb-2 text-purple-500" />
            <div className="font-bold text-2xl">30+</div>
            <div className="text-xs text-foreground/60">Languages</div>
          </CardContent>
        </Card>
      </div>

      {/* Enterprise Support & Consultation */}
      <Card className="glass shadow-premium border-black/5 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Info */}
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg opacity-60"></div>
                <div className="relative bg-black/50 backdrop-blur-xl border border-white/20 rounded-xl p-3">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-2xl">Enterprise Consultation</h3>
                <p className="text-foreground/60 text-sm">Free 30-minute strategy session</p>
              </div>
            </div>

            <p className="text-foreground/70 mb-6 leading-relaxed">
              Talk to our AI infrastructure experts. Get personalized recommendations for scaling
              your agents, optimizing performance, and implementing enterprise features.
            </p>

            <div className="space-y-3 mb-6">
              {[
                { icon: Clock, text: "30-minute deep dive session" },
                { icon: Users, text: "Dedicated solutions architect" },
                { icon: Video, text: "Screen sharing & live demos" },
                { icon: Sparkles, text: "Custom implementation roadmap" },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm text-foreground/70">{item.text}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">No Credit Card</Badge>
              <Badge variant="outline" className="text-xs">100% Free</Badge>
              <Badge variant="outline" className="text-xs">No Sales Pressure</Badge>
            </div>
          </CardContent>

          {/* Right: Cal.com Embed */}
          <CardContent className="p-0 bg-background/30 flex items-center justify-center">
            <div className="w-full h-full min-h-[500px] relative">
              {/* Cal.com Inline Embed */}
              <iframe
                src="https://cal.com/advit-ai-labs/30min?embed=true"
                className="w-full h-full border-0"
                style={{ minHeight: '500px' }}
                frameBorder="0"
              ></iframe>

              {/* Fallback if no Cal.com account set up yet */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                <div className="text-center p-8">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-primary" />
                  <h4 className="font-bold text-xl mb-2">Book Your Free Session</h4>
                  <p className="text-foreground/60 text-sm mb-4">
                    Powered by Cal.com - 100% Free Forever
                  </p>
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-purple-500 pointer-events-auto"
                    onClick={() => window.open("https://cal.com/advit-ai-labs/30min", "_blank")}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Now
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
