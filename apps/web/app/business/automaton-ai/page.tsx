"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Phone,
  Calendar,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  Radio,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";

export default function AutomatonAIDemo() {
  const [calReady, setCalReady] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Cal.com Script */}
      <Script
        src="https://app.cal.com/embed/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== "undefined" && (window as any).Cal) {
            (window as any).Cal("init", "30min", { origin: "https://app.cal.com" });
            (window as any).Cal.ns["30min"]("ui", {
              hideEventTypeDetails: false,
              layout: "month_view",
            });
            setCalReady(true);
          }
        }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-32 pb-20 px-6 bg-architect-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-[#3F51B5] rounded-2xl blur-xl opacity-20 animate-pulse"></div>
                <div className="relative glass shadow-premium rounded-2xl p-6">
                  <img
                    src="/advit-labs-logo.png"
                    alt="ADVIT AI Labs"
                    className="w-16 h-16 object-contain"
                  />
                </div>
              </div>
            </div>
            <h1 className="font-outfit font-black text-5xl mb-4">
              ADVIT<span className="text-xs align-super">™</span> AI Labs
            </h1>
            <p className="text-foreground/60 text-xl mb-2">
              Conversational AI Service for AutomatonAI
            </p>
            <Badge className="bg-accent/10 text-accent border-accent/20">
              <Radio className="w-3 h-3 mr-1 animate-pulse" />
              Live Demo Available
            </Badge>
          </div>

          {/* Main CTA Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            {/* Live Demo Card */}
            <Card className="glass shadow-premium border-black/5 hover:shadow-2xl transition-all">
              <CardContent className="p-8">
                <div className="bg-accent/10 rounded-full p-4 w-fit mb-4">
                  <Phone className="w-8 h-8 text-accent" />
                </div>
                <h2 className="font-outfit font-black text-2xl mb-3">
                  Try Voice AI Now
                </h2>
                <p className="text-foreground/60 mb-6">
                  Click below to start a live voice conversation with our AI agent.
                  Experience ultra-realistic conversations in real-time.
                </p>
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex items-center gap-2 text-foreground/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span>No signup required</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span>&lt;200ms latency</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span>Instant connection</span>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="bg-accent text-white hover:bg-accent/90 font-bold shadow-premium w-full"
                  asChild
                >
                  <Link href="/business/voice-meeting">
                    <Phone className="w-5 h-5 mr-2" />
                    Start Live Call Now
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Schedule Meeting Card */}
            <Card className="glass shadow-premium border-black/5 hover:shadow-2xl transition-all">
              <CardContent className="p-8">
                <div className="bg-accent/10 rounded-full p-4 w-fit mb-4">
                  <Calendar className="w-8 h-8 text-accent" />
                </div>
                <h2 className="font-outfit font-black text-2xl mb-3">
                  Schedule Demo Call
                </h2>
                <p className="text-foreground/60 mb-6">
                  Book a scheduled voice meeting with our team. The meeting will be
                  conducted via voice AI for a personalized experience.
                </p>
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex items-center gap-2 text-foreground/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span>30-minute sessions</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span>Voice AI conversation</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span>Product walkthrough</span>
                  </div>
                </div>
                <Button
                  size="lg"
                  variant="outline"
                  className="crisp-border font-bold w-full"
                  data-cal-link="automaton-ai/30min"
                  data-cal-namespace="30min"
                  data-cal-config='{"layout":"month_view"}'
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Meeting
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: "Response Time", value: "<200ms" },
              { label: "Uptime", value: "99.9%" },
              { label: "Languages", value: "30+" },
              { label: "Active Now", value: "Live" },
            ].map((stat) => (
              <Card key={stat.label} className="glass shadow-premium border-black/5">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-black mb-1">{stat.value}</div>
                  <div className="text-foreground/60 text-xs">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-outfit font-black text-3xl mb-4">
              Why ADVIT Voice AI?
            </h2>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              Enterprise-grade conversational AI built for AutomatonAI's marketplace
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: "Ultra-Low Latency",
                description: "Sub-200ms response time for natural conversations",
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "End-to-end encryption with SOC 2 compliance",
              },
              {
                icon: Clock,
                title: "24/7 Availability",
                description: "Always-on AI agents that never sleep",
              },
              {
                icon: TrendingUp,
                title: "Auto-Scaling",
                description: "Handle millions of concurrent conversations",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="glass shadow-premium border-black/5 hover:shadow-xl transition-all"
                >
                  <CardContent className="p-6">
                    <div className="bg-accent/10 rounded-xl p-3 w-fit mb-4">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-foreground/60 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="glass shadow-premium border-black/5">
            <CardContent className="p-8">
              <h2 className="font-outfit font-black text-2xl mb-6">
                Service Specifications
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold mb-3">Technical Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Agent Type:</span>
                      <span className="font-medium">Outbound Sales</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Connection:</span>
                      <span className="font-medium">WebRTC + WebSocket</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Latency:</span>
                      <span className="font-medium">&lt;200ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Languages:</span>
                      <span className="font-medium">30+ supported</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-3">Capabilities</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></div>
                      <span>Lead qualification & sales</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></div>
                      <span>Natural interruption handling</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></div>
                      <span>Emotion detection & matching</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></div>
                      <span>Contextual conversation updates</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-black/5">
                <Button
                  variant="outline"
                  className="crisp-border w-full"
                  asChild
                >
                  <Link href="https://docs.advitlabs.ai/voice-ai" target="_blank">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Full Documentation
                  </Link>
                </Button>
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
            Conversational AI Infrastructure Provider for AutomatonAI
          </p>
        </div>
      </footer>
    </div>
  );
}
