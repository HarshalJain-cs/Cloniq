"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import {
  ArrowRight,
  Brain,
  Cpu,
  GraduationCap,
  Tag,
  Code2,
  LayoutGrid,
  MessageSquare,
  Database,
  Zap,
  Building2,
  Landmark,
  HeartPulse,
  ShieldCheck,
  Sprout,
  Car,
  HardHat,
  Globe,
  Factory,
  SmilePlus,
  Hotel,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Linkedin,
  Twitter,
  Users,
  ChevronRight,
  Sparkles,
} from "lucide-react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { "agent-id"?: string },
        HTMLElement
      >;
    }
  }
}

const products = [
  {
    icon: Brain,
    name: "ADVIT\u2122 Studio",
    tagline: "Unified Deep Learning Platform",
    description:
      "End-to-end data management, model training, inference, and edge deployment. White-labeled and self-hosted for complete control.",
    highlight: "2x faster development",
    features: [
      "Data Management",
      "Model Training",
      "Inference Pipeline",
      "Edge Deployment",
    ],
  },
  {
    icon: Cpu,
    name: "ADAPT AI",
    tagline: "AutoML Platform",
    description:
      "Automatic feature engineering, model tuning, validation, and deployment. Turn weeks of ML engineering into hours.",
    highlight: "Weeks to hours",
    features: [
      "Feature Engineering",
      "Model Tuning",
      "Auto Validation",
      "One-Click Deploy",
    ],
  },
  {
    icon: GraduationCap,
    name: "ADVIT\u2122 AI Labs",
    tagline: "AI Centre of Excellence",
    description:
      "Shared GPUs, Jupyter notebooks, mentorship programs, and edge deployment for students and researchers.",
    highlight: "For education & research",
    features: [
      "Shared GPUs",
      "Jupyter Notebooks",
      "Mentorship",
      "Edge Deployment",
    ],
  },
];

const services = [
  {
    icon: Tag,
    name: "Data Labeling",
    description:
      "Precision data annotation and labeling services for training production-grade AI models.",
  },
  {
    icon: Code2,
    name: "Custom AI Application",
    description:
      "Bespoke AI solutions designed and built to solve your specific business challenges.",
  },
  {
    icon: LayoutGrid,
    name: "Model Gallery",
    description:
      "Pre-trained models ready for fine-tuning and deployment across various domains.",
  },
  {
    icon: MessageSquare,
    name: "AI Consultancy",
    description:
      "Strategic AI advisory services to identify opportunities and build your AI roadmap.",
  },
  {
    icon: Database,
    name: "Data Zoo",
    description:
      "Curated datasets across industries to accelerate your model development lifecycle.",
  },
];

const industries = [
  { icon: Building2, name: "Retail" },
  { icon: Landmark, name: "Banking & Finance" },
  { icon: HeartPulse, name: "Healthcare" },
  { icon: ShieldCheck, name: "Insurance" },
  { icon: Sprout, name: "Agriculture" },
  { icon: Car, name: "Automotive" },
  { icon: HardHat, name: "Construction" },
  { icon: Globe, name: "Smart City" },
  { icon: Factory, name: "Manufacturing" },
  { icon: SmilePlus, name: "Dentistry" },
  { icon: Hotel, name: "Hospitality" },
];

const founders = [
  {
    name: "Bhushan Muthiyan",
    role: "Founder",
    description: "Visionary leader driving AI democratization across industries.",
  },
  {
    name: "Mukesh Muthiyan",
    role: "CTO",
    description: "10+ years of experience building scalable AI infrastructure.",
  },
  {
    name: "Narendra Firodia",
    role: "Angel Investor",
    description: "Strategic investor fueling innovation in AI and deep tech.",
  },
];

export default function AutomatonAIWebsite() {
  useEffect(() => {
    if (document.querySelector('script[src*="elevenlabs.io/convai-widget"]')) {
      return;
    }
    const script = document.createElement("script");
    script.src = "https://elevenlabs.io/convai-widget/index.js";
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);

    return () => {
      // Cleanup is intentionally skipped to avoid breaking the widget on HMR
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background font-outfit">
      {/* ── ElevenLabs Voice Bot ── */}
      <div className="fixed bottom-6 right-6 z-50">
        <elevenlabs-convai
          agent-id={process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════
          NAVIGATION
      ══════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/advit-labs-logo.png"
              alt="ADVIT AI Labs"
              className="w-8 h-8 object-contain"
            />
            <span className="font-outfit font-black text-lg tracking-tight">
              Automaton AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-foreground/60">
            <button onClick={() => scrollTo("products")} className="hover:text-foreground transition-colors">
              Products
            </button>
            <button onClick={() => scrollTo("services")} className="hover:text-foreground transition-colors">
              Services
            </button>
            <button onClick={() => scrollTo("industries")} className="hover:text-foreground transition-colors">
              Industries
            </button>
            <button onClick={() => scrollTo("team")} className="hover:text-foreground transition-colors">
              Team
            </button>
            <button onClick={() => scrollTo("contact")} className="hover:text-foreground transition-colors">
              Contact
            </button>
          </div>
          <Button
            size="sm"
            className="bg-accent text-white hover:bg-accent/90 font-bold"
            onClick={() => scrollTo("contact")}
          >
            Get in Touch
          </Button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════════ */}
      <section className="pt-40 pb-28 px-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          <Badge className="bg-accent/10 text-accent border-accent/20 mb-8">
            <Sparkles className="w-3 h-3 mr-1.5" />
            Automaton AI Infosystem Pvt. Ltd.
          </Badge>

          <h1 className="font-outfit font-black text-6xl md:text-7xl lg:text-8xl tracking-tight mb-6 leading-[0.95]">
            ADVIT<span className="text-xs align-super">&trade;</span>{" "}
            <span className="text-accent">AI</span> Labs
          </h1>

          <p className="text-foreground/70 text-xl md:text-2xl font-medium mb-4 max-w-2xl mx-auto">
            AI with Purpose, Progress with Precision
          </p>

          <p className="text-foreground/50 text-base md:text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            Our mission is to democratize data and make cutting-edge AI
            accessible across industries — empowering businesses of every size
            to harness the power of intelligent automation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-accent text-white hover:bg-accent/90 font-bold px-10"
              onClick={() => scrollTo("contact")}
            >
              Book a Demo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="crisp-border font-bold px-10"
              onClick={() => scrollTo("products")}
            >
              Explore Products
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-20">
            {[
              { value: "11+", label: "Industries" },
              { value: "3", label: "Core Products" },
              { value: "2x", label: "Faster Dev" },
              { value: "24/7", label: "AI Support" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-black mb-1">{stat.value}</div>
                <div className="text-foreground/50 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PRODUCTS SECTION
      ══════════════════════════════════════════════════════════ */}
      <section id="products" className="py-24 px-6 border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-accent/10 text-accent border-accent/20 mb-4">
              Products
            </Badge>
            <h2 className="font-outfit font-black text-4xl md:text-5xl mb-4">
              Our Core Platforms
            </h2>
            <p className="text-foreground/50 text-lg max-w-xl mx-auto">
              Enterprise-grade AI platforms built to accelerate every stage of
              your machine learning lifecycle.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => {
              const Icon = product.icon;
              return (
                <Card
                  key={product.name}
                  className="glass shadow-premium border-black/5 hover:shadow-2xl transition-all"
                >
                  <CardContent className="p-8">
                    <div className="bg-accent/10 rounded-2xl p-4 w-fit mb-6">
                      <Icon className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-outfit font-black text-xl mb-1">
                      {product.name}
                    </h3>
                    <p className="text-accent text-sm font-semibold mb-3">
                      {product.tagline}
                    </p>
                    <p className="text-foreground/60 text-sm leading-relaxed mb-5">
                      {product.description}
                    </p>
                    <Badge className="bg-black text-white mb-5">
                      <Zap className="w-3 h-3 mr-1" />
                      {product.highlight}
                    </Badge>
                    <div className="grid grid-cols-2 gap-2 pt-4 border-t border-black/5">
                      {product.features.map((f) => (
                        <div
                          key={f}
                          className="text-xs text-foreground/50 flex items-center gap-1.5"
                        >
                          <div className="w-1 h-1 rounded-full bg-accent shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SERVICES SECTION
      ══════════════════════════════════════════════════════════ */}
      <section id="services" className="py-24 px-6 bg-black/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-accent/10 text-accent border-accent/20 mb-4">
              Services
            </Badge>
            <h2 className="font-outfit font-black text-4xl md:text-5xl mb-4">
              What We Offer
            </h2>
            <p className="text-foreground/50 text-lg max-w-xl mx-auto">
              End-to-end AI services to power your organization from data to
              deployment.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.name}
                  className="glass shadow-premium border-black/5 hover:shadow-2xl transition-all"
                >
                  <CardContent className="p-8">
                    <div className="bg-accent/10 rounded-xl p-3 w-fit mb-5">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-outfit font-bold text-lg mb-2">
                      {service.name}
                    </h3>
                    <p className="text-foreground/60 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          INDUSTRIES SECTION
      ══════════════════════════════════════════════════════════ */}
      <section id="industries" className="py-24 px-6 border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-accent/10 text-accent border-accent/20 mb-4">
              Industries
            </Badge>
            <h2 className="font-outfit font-black text-4xl md:text-5xl mb-4">
              Built for Every Sector
            </h2>
            <p className="text-foreground/50 text-lg max-w-xl mx-auto">
              Our AI platforms serve organizations across 11+ industries
              worldwide.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {industries.map((industry) => {
              const Icon = industry.icon;
              return (
                <div
                  key={industry.name}
                  className="glass border border-black/5 p-5 text-center hover:border-accent/30 hover:shadow-premium transition-all group"
                >
                  <div className="bg-accent/10 rounded-xl p-3 w-fit mx-auto mb-3 group-hover:bg-accent/20 transition-colors">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-xs font-semibold text-foreground/70 group-hover:text-foreground transition-colors">
                    {industry.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TEAM SECTION
      ══════════════════════════════════════════════════════════ */}
      <section id="team" className="py-24 px-6 bg-black/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-accent/10 text-accent border-accent/20 mb-4">
              Leadership
            </Badge>
            <h2 className="font-outfit font-black text-4xl md:text-5xl mb-4">
              Meet the Team
            </h2>
            <p className="text-foreground/50 text-lg max-w-xl mx-auto">
              The visionaries behind Automaton AI&apos;s mission to democratize
              artificial intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {founders.map((founder) => (
              <Card
                key={founder.name}
                className="glass shadow-premium border-black/5 hover:shadow-2xl transition-all"
              >
                <CardContent className="p-8 text-center">
                  <div className="bg-accent/10 rounded-full p-5 w-fit mx-auto mb-5">
                    <Users className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-outfit font-black text-lg mb-1">
                    {founder.name}
                  </h3>
                  <p className="text-accent text-sm font-semibold mb-3">
                    {founder.role}
                  </p>
                  <p className="text-foreground/50 text-sm leading-relaxed">
                    {founder.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CONTACT SECTION
      ══════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-24 px-6 border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-accent/10 text-accent border-accent/20 mb-4">
              Contact
            </Badge>
            <h2 className="font-outfit font-black text-4xl md:text-5xl mb-4">
              Get in Touch
            </h2>
            <p className="text-foreground/50 text-lg max-w-xl mx-auto">
              Ready to transform your business with AI? Let&apos;s talk.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Address Card */}
            <Card className="glass shadow-premium border-black/5">
              <CardContent className="p-8">
                <div className="bg-accent/10 rounded-xl p-3 w-fit mb-5">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-outfit font-bold text-lg mb-3">
                  Headquarters
                </h3>
                <p className="text-foreground/60 text-sm leading-relaxed">
                  410, Suratwala Mark Plazzo,
                  <br />
                  Hinjewadi, Pune,
                  <br />
                  Maharashtra 411057, India
                </p>
              </CardContent>
            </Card>

            {/* Contact Details Card */}
            <Card className="glass shadow-premium border-black/5">
              <CardContent className="p-8">
                <div className="bg-accent/10 rounded-xl p-3 w-fit mb-5">
                  <Phone className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-outfit font-bold text-lg mb-4">
                  Reach Us
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-accent shrink-0" />
                    <span className="text-foreground/60">
                      India: +91 8698200400
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-accent shrink-0" />
                    <span className="text-foreground/60">
                      US: +1 (669) 238-6880
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-accent shrink-0" />
                    <a
                      href="mailto:info@automatonai.com"
                      className="text-foreground/60 hover:text-accent transition-colors"
                    >
                      info@automatonai.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <ExternalLink className="w-4 h-4 text-accent shrink-0" />
                    <a
                      href="https://automatonai.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/60 hover:text-accent transition-colors"
                    >
                      automatonai.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════ */}
      <footer className="py-12 px-6 border-t border-black/5 bg-black/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <img
                src="/advit-labs-logo.png"
                alt="ADVIT AI Labs"
                className="w-10 h-10 object-contain"
              />
              <div>
                <div className="font-outfit font-black text-lg">
                  Automaton AI
                </div>
                <p className="text-foreground/40 text-xs">
                  Automaton AI Infosystem Pvt. Ltd.
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://linkedin.com/company/automatonai"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent/10 rounded-full p-2.5 hover:bg-accent/20 transition-colors"
              >
                <Linkedin className="w-4 h-4 text-accent" />
              </a>
              <a
                href="https://twitter.com/automatonai"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent/10 rounded-full p-2.5 hover:bg-accent/20 transition-colors"
              >
                <Twitter className="w-4 h-4 text-accent" />
              </a>
              <a
                href="mailto:info@automatonai.com"
                className="bg-accent/10 rounded-full p-2.5 hover:bg-accent/20 transition-colors"
              >
                <Mail className="w-4 h-4 text-accent" />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-black/5 text-center">
            <p className="text-foreground/40 text-xs">
              &copy; {new Date().getFullYear()} Automaton AI Infosystem Pvt.
              Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
