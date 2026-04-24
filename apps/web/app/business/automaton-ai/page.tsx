"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import {
  ArrowRight,
  CheckCircle2,
  Mic,
  BarChart3,
  Brain,
  Globe2,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  Users,
  Sparkles,
  Radio,
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";

const services = [
  {
    id: "conversational-ai",
    name: "Conversational AI Studio",
    description: "Ultra-realistic voice AI agents for outbound sales and lead qualification.",
    icon: Mic,
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    features: [
      "Outbound sales & lead qualification",
      "Ultra-low latency (<200ms)",
      "WebRTC & WebSocket streaming",
      "Multi-language support (30+ languages)",
    ],
    status: "live",
    metrics: {
      uptime: "99.9%",
      latency: "<200ms",
      languages: "30+",
    },
  },
  {
    id: "analytics",
    name: "Agent Analytics Hub",
    description: "Real-time insights and predictive analytics for your AI agents.",
    icon: BarChart3,
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    features: [
      "Real-time conversation analytics",
      "Predictive sentiment analysis",
      "Custom KPI tracking",
      "Automated reporting dashboards",
    ],
    status: "live",
    metrics: {
      dataPoints: "50M+/day",
      accuracy: "95%",
      processing: "Real-time",
    },
  },
  {
    id: "training",
    name: "Enterprise Training Suite",
    description: "Fine-tune agents on your proprietary data with enterprise-grade security.",
    icon: Brain,
    gradient: "from-orange-500 via-red-500 to-pink-500",
    features: [
      "Custom model fine-tuning",
      "Proprietary data integration",
      "A/B testing framework",
      "Version control & rollback",
    ],
    status: "beta",
    metrics: {
      trainTime: "< 24hrs",
      accuracy: "+40%",
      datasets: "Unlimited",
    },
  },
  {
    id: "omnichannel",
    name: "Omnichannel Deployment",
    description: "Deploy agents across 15+ platforms with unified management.",
    icon: Globe2,
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    features: [
      "15+ platform integrations",
      "Unified conversation history",
      "Cross-platform analytics",
      "Single API deployment",
    ],
    status: "live",
    metrics: {
      platforms: "15+",
      deployment: "< 5min",
      scaling: "Auto",
    },
  },
];

const benefits = [
  {
    icon: Zap,
    title: "Production-Ready",
    description: "Enterprise-grade infrastructure with 99.9% uptime SLA",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 Type II compliant with end-to-end encryption",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Dedicated support team with <1hr response time",
  },
  {
    icon: TrendingUp,
    title: "Infinite Scale",
    description: "Auto-scaling infrastructure handling millions of requests",
  },
];

export default function AutomatonAILanding() {
  useEffect(() => {
    // Initialize Cal.com after script loads
    if (typeof window !== 'undefined' && (window as any).Cal) {
      (window as any).Cal("init", "30min", { origin: "https://app.cal.com" });
      (window as any).Cal.ns["30min"]("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Cal.com Script */}
      <Script
        src="https://app.cal.com/embed/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== 'undefined' && (window as any).Cal) {
            (window as any).Cal("init", "30min", { origin: "https://app.cal.com" });
            (window as any).Cal.ns["30min"]("ui", {
              hideEventTypeDetails: false,
              layout: "month_view",
            });
          }
        }}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-32 pb-20 px-6 bg-architect-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Logo & Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-[#3F51B5] rounded-2xl blur-xl opacity-20 animate-pulse"></div>
              <div className="relative glass shadow-premium rounded-2xl p-6">
                <img
                  src="/advit-labs-logo.png"
                  alt="ADVIT AI Labs"
                  className="w-20 h-20 object-contain"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-outfit font-black text-5xl">
                  ADVIT<span className="text-xs align-super">™</span> AI Labs
                </h1>
                <Badge className="bg-accent/10 text-accent border-accent/20">
                  <Radio className="w-3 h-3 mr-1 animate-pulse" />
                  Partner Program
                </Badge>
              </div>
              <p className="text-foreground/60 text-xl font-medium">
                Enterprise AI Infrastructure for AutomatonAI
              </p>
            </div>
          </div>

          {/* Hero Content */}
          <div className="max-w-3xl mb-12">
            <h2 className="font-outfit font-black text-6xl mb-6 leading-tight">
              Premium AI Services
              <br />
              <span className="text-accent">Built for Scale</span>
            </h2>
            <p className="text-foreground/60 text-xl leading-relaxed mb-8">
              Access ADVIT AI Labs' enterprise-grade AI infrastructure. From ultra-realistic
              conversational AI to advanced analytics, we power AutomatonAI's next-generation
              agent marketplace with production-ready services.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-accent text-white hover:bg-accent/90 font-bold shadow-premium"
                asChild
              >
                <Link href="#services">
                  Explore Services
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="crisp-border font-bold"
                data-cal-link="automaton-ai/30min"
                data-cal-namespace="30min"
                data-cal-config='{"layout":"month_view"}'
              >
                Schedule Demo
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Uptime SLA", value: "99.9%" },
              { label: "Response Time", value: "<200ms" },
              { label: "Platforms", value: "15+" },
              { label: "Daily Requests", value: "50M+" },
            ].map((stat) => (
              <Card key={stat.label} className="glass shadow-premium border-black/5">
                <CardContent className="p-6">
                  <div className="text-4xl font-black mb-2">{stat.value}</div>
                  <div className="text-foreground/60 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4">Why ADVIT AI Labs</Badge>
            <h2 className="font-outfit font-black text-4xl mb-4">
              Enterprise-Grade Infrastructure
            </h2>
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
              Built for businesses that demand reliability, security, and scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title} className="glass shadow-premium border-black/5 hover:shadow-2xl transition-all">
                  <CardContent className="p-6">
                    <div className="bg-accent/10 rounded-xl p-4 w-fit mb-4">
                      <Icon className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-bold text-xl mb-2">{benefit.title}</h3>
                    <p className="text-foreground/60">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4">Premium Services</Badge>
            <h2 className="font-outfit font-black text-4xl mb-4">
              Complete AI Service Suite
            </h2>
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
              Everything AutomatonAI needs to power the next generation of AI agents
            </p>
          </div>

          <div className="space-y-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.id}
                  className="glass shadow-premium border-black/5 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                >
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-3 gap-0">
                      {/* Service Info */}
                      <div className="md:col-span-2 p-8">
                        <div className="flex items-start gap-4 mb-6">
                          <div className={`bg-gradient-to-br ${service.gradient} rounded-2xl p-4`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-outfit font-black text-3xl">{service.name}</h3>
                              <Badge
variant={service.status === "live" ? "default" : "outline"}
                                className={
                                  service.status === "live"
                                    ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/10"
                                    : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/10"
                                }
                              >
                                <Radio className="w-3 h-3 mr-1 animate-pulse" />
                                {service.status === "live" ? "Live" : "Beta"}
                              </Badge>
                            </div>
                            <p className="text-foreground/60 text-lg mb-6">{service.description}</p>

                            {/* Features */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                              {service.features.map((feature) => (
                                <div key={feature} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                  <span className="text-sm">{feature}</span>
                                </div>
                              ))}
                            </div>

                            <Link href={`/business/services/${service.id}`}>
                              <Button className={`bg-gradient-to-r ${service.gradient} text-white border-0`}>
                                Launch Studio
                                <ArrowRight className="ml-2 w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="bg-muted/50 p-8 border-l border-black/5">
                        <h4 className="font-bold text-sm text-foreground/60 mb-6">Key Metrics</h4>
                        <div className="space-y-4">
                          {Object.entries(service.metrics).map(([key, value]) => (
                            <div key={key}>
                              <div className="text-2xl font-black text-accent mb-1">{value}</div>
                              <div className="text-xs text-foreground/60 capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <Card className="glass shadow-premium border-black/5 overflow-hidden">
            <CardContent className="p-12">
              <div className="text-center">
                <div className="bg-accent/10 rounded-full p-4 w-fit mx-auto mb-6">
                  <Sparkles className="w-12 h-12 text-accent" />
                </div>
                <h2 className="font-outfit font-black text-4xl mb-4">
                  Ready to Scale Your AI Infrastructure?
                </h2>
                <p className="text-foreground/60 text-lg mb-8 max-w-2xl mx-auto">
                  Get access to ADVIT AI Labs' enterprise services. Production-ready,
                  infinitely scalable, with 24/7 dedicated support.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-accent text-white hover:bg-accent/90 font-bold shadow-premium"
                    data-cal-link="automaton-ai/30min"
                    data-cal-namespace="30min"
                    data-cal-config='{"layout":"month_view"}'
                  >
                    Schedule Demo
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="crisp-border font-bold"
                    asChild
                  >
                    <Link href="https://docs.advitlabs.ai">
                      View Documentation
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-black/5">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/advit-labs-logo.png" alt="ADVIT AI Labs" className="w-12 h-12" />
            <div className="font-outfit font-black text-2xl">
              ADVIT<span className="text-xs align-super">™</span> AI Labs
            </div>
          </div>
          <p className="text-foreground/60 mb-4">
            Enterprise AI Infrastructure Provider for AutomatonAI
          </p>
          <div className="flex gap-6 justify-center text-sm text-foreground/40">
            <Link href="/privacy" className="hover:text-foreground/60 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground/60 transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-foreground/60 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
