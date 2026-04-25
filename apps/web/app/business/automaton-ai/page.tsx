"use client";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Phone, Calendar, Zap, Shield, Radio, Globe, ExternalLink } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

export default function AutomatonAIDemo() {
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
          }
        }}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="bg-accent/10 rounded-2xl p-4">
              <img
                src="/advit-labs-logo.png"
                alt="ADVIT AI Labs"
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
            <h1 className="font-outfit font-black text-5xl mb-4">
              ADVIT<span className="text-xs align-super">™</span> AI Labs
            </h1>
            <p className="text-foreground/60 text-xl mb-4">
              Voice AI Service for AutomatonAI
            </p>
            <Badge className="bg-accent/10 text-accent border-accent/20 mb-6">
              <Radio className="w-3 h-3 mr-1 animate-pulse" />
              Live Demo Available
            </Badge>

            {/* Demo Website Button */}
            <div className="mt-6">
              <Button
                size="lg"
                className="bg-accent text-white hover:bg-accent/90 font-bold px-10"
                asChild
              >
                <Link href="/business/automaton-ai/website">
                  <Globe className="w-5 h-5 mr-2" />
                  View Demo Website
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Description */}
          <p className="text-foreground/70 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            Experience our ultra-realistic conversational AI. Talk to our outbound sales
            representative agent powered by advanced voice technology with sub-200ms latency.
          </p>

          {/* CTA Buttons */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-20">
            {/* Instant Call */}
            <Card className="glass shadow-premium border-black/5 hover:shadow-2xl transition-all">
              <CardContent className="p-8 text-center">
                <div className="bg-accent/10 rounded-full p-4 w-fit mx-auto mb-4">
                  <Phone className="w-8 h-8 text-accent" />
                </div>
                <h2 className="font-bold text-xl mb-3">Try Now</h2>
                <p className="text-foreground/60 mb-6 text-sm">
                  Start a live voice conversation instantly. No signup required.
                </p>
                <Button
                  size="lg"
                  className="bg-accent text-white hover:bg-accent/90 font-bold w-full"
                  asChild
                >
                  <Link href="/business/voice-meeting">
                    <Phone className="w-5 h-5 mr-2" />
                    Start Call
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card className="glass shadow-premium border-black/5 hover:shadow-2xl transition-all">
              <CardContent className="p-8 text-center">
                <div className="bg-accent/10 rounded-full p-4 w-fit mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-accent" />
                </div>
                <h2 className="font-bold text-xl mb-3">Schedule Demo</h2>
                <p className="text-foreground/60 mb-6 text-sm">
                  Book a 30-minute voice meeting at your convenience.
                </p>
                <Button
                  size="lg"
                  variant="outline"
                  className="crisp-border font-bold w-full"
                  data-cal-link="automaton-ai/30min"
                  data-cal-namespace="30min"
                  data-cal-config='{"layout":"month_view"}'
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Meeting
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-20">
            {[
              { label: "Response", value: "<200ms" },
              { label: "Uptime", value: "99.9%" },
              { label: "Languages", value: "30+" },
              { label: "Status", value: "Live" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black mb-1">{stat.value}</div>
                <div className="text-foreground/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              {
                icon: Zap,
                title: "Ultra-Low Latency",
                description: "Sub-200ms response for natural conversations",
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "End-to-end encrypted with SOC 2 compliance",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="glass shadow-premium border-black/5">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="bg-accent/10 rounded-xl p-3 shrink-0">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold mb-1">{feature.title}</h3>
                      <p className="text-foreground/60 text-sm">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-black/5">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/advit-labs-logo.png" alt="ADVIT AI Labs" className="w-10 h-10" />
            <div className="font-outfit font-black text-xl">
              ADVIT<span className="text-xs align-super">™</span> AI Labs
            </div>
          </div>
          <p className="text-foreground/60 text-sm">
            Voice AI Provider for AutomatonAI
          </p>
        </div>
      </footer>
    </div>
  );
}
