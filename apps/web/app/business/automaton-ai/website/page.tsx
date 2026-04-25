"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";
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
  Youtube,
  Facebook,
  Users,
  ChevronRight,
  Sparkles,
  Monitor,
  HardDrive,
  Container,
  Settings,
  BarChart3,
  Share2,
  Layers,
  Boxes,
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

const coreFeatures = [
  { icon: Users, name: "Industry Expert's Assistance in AI" },
  { icon: Share2, name: "Access to Community AI Models" },
  { icon: Database, name: "AI Project & Dataset Assistance" },
  { icon: HardDrive, name: "Access to AI Infrastructure" },
  { icon: Monitor, name: "Deploy AI Project in Real-Time on Edge Devices" },
];

const studentFeatures = [
  { icon: Layers, name: "Data Preparation (Dataset Builder)" },
  { icon: Database, name: "Dataset Management" },
  { icon: BarChart3, name: "Monitor & QA AI Projects in Runtime" },
  { icon: Cpu, name: "Shared GPUs" },
  { icon: Code2, name: "Shared Jupyter Notebooks" },
  { icon: Container, name: "Download Docker for Inference" },
  { icon: Settings, name: "Model Builder" },
  { icon: Boxes, name: "Develop Models on Real-World Data" },
];

const industries = [
  {
    icon: Sprout,
    name: "Agriculture",
    description: "AI-powered automated equipment, weather forecasting, soil & plant health analysis, and pesticide optimization.",
  },
  {
    icon: Factory,
    name: "Manufacturing",
    description: "We specialize in AI and ML in manufacturing to manage data, improve production efficiency, and cut losses.",
  },
  {
    icon: Globe,
    name: "Smart City",
    description: "We design AI models to make cities truly smart by digitalizing the city administration, centralizing surveillance, and simplifying waste management.",
  },
  {
    icon: Building2,
    name: "Retail",
    description: "We help your retail business go digital and use AI for efficient customer service, order management, feedback, and customer retention.",
  },
  {
    icon: Landmark,
    name: "Banking & Finance",
    description: "Centralize your banking activities like customer service, customer profile management, and personalized marketing activities with the help of AI.",
  },
  {
    icon: HeartPulse,
    name: "Healthcare",
    description: "Simplify your healthcare management services by automating patient data collection and management along with their insurance information and medical histories.",
  },
];

const allIndustries = [
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

const services = [
  { icon: Tag, name: "Data Labeling", description: "Automated and enterprise-grade data annotation pipeline for training datasets." },
  { icon: Code2, name: "Custom AI Application", description: "Bespoke AI application development tailored to client business needs." },
  { icon: LayoutGrid, name: "Model Gallery", description: "Pre-built, ready-to-use AI model library for faster deployment." },
  { icon: MessageSquare, name: "AI Consultancy", description: "Strategic advisory to help organizations navigate AI transformation." },
  { icon: Database, name: "Data Zoo", description: "Curated, high-quality datasets for AI model training." },
];

const products = [
  {
    icon: Brain,
    name: "ADVIT\u2122 Studio",
    tagline: "Deep Learning Platform",
    description: "A unified Deep Learning Platform \u2014 Manage all your data, AI infrastructure & projects on a single platform. White-labeled, self-hosted DLOps platform for enterprises.",
    features: ["One-Click Model Training", "Transfer Learning", "Model Versioning", "Real-Time Inference", "Data Labeling", "Edge Deployment"],
  },
  {
    icon: Cpu,
    name: "ADAPT AI",
    tagline: "AutoML Platform",
    description: "An AutoML platform that empowers data scientists to work in a structured, fast, and competent manner. Compresses ML tasks from weeks to hours.",
    features: ["Feature Engineering", "Model Tuning", "Model Selection", "Time-Series Analysis", "Auto Pipeline", "Business Reporting"],
  },
  {
    icon: GraduationCap,
    name: "ADVIT\u2122 AI Labs",
    tagline: "AI Centre of Excellence",
    description: "A turnkey, state-of-the-art modular learning platform designed for students and researchers to leverage AI with real-world projects and datasets.",
    features: ["Shared GPUs", "Jupyter Notebooks", "Expert Mentorship", "Edge AI Deployment", "Dataset Builder", "Docker Inference"],
  },
];

const founders = [
  { name: "Bhushan Muthiyan", role: "Founder", description: "Visionary entrepreneur driving overall strategy, innovation, and business growth in AI." },
  { name: "Mukesh Muthiyan", role: "CTO", description: "Over 10 years of hands-on software development. Leads technology strategy and product innovation." },
  { name: "Narendra Firodia", role: "Angel Investor", description: "Strategic advisor bringing business experience, financial backing, and fostering growth." },
];

export default function AutomatonAIWebsite() {
  useEffect(() => {
    if (document.querySelector('script[src*="elevenlabs.io/convai-widget"]')) return;
    const s = document.createElement("script");
    s.src = "https://elevenlabs.io/convai-widget/index.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-background font-outfit">
      {/* ElevenLabs Conversational AI Bot */}
      <div className="fixed bottom-6 right-6 z-50">
        <elevenlabs-convai agent-id="agent_1401kq1hf3nxehqv6f156s06ve83" />
      </div>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/advit-labs-logo.png" alt="ADVIT AI Labs" className="w-8 h-8 object-contain" />
            <span className="font-outfit font-black text-lg tracking-tight">Automaton AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-foreground/60">
            {["products", "features", "industries", "services", "team", "contact"].map((s) => (
              <button key={s} onClick={() => scrollTo(s)} className="hover:text-foreground transition-colors capitalize">
                {s}
              </button>
            ))}
          </div>
          <Button size="sm" className="bg-accent text-white hover:bg-accent/90 font-bold" onClick={() => scrollTo("contact")}>
            Get in Touch
          </Button>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-40 pb-28 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative">
          <Badge className="bg-accent/10 text-accent border-accent/20 mb-6">
            <Sparkles className="w-3 h-3 mr-1.5" />
            AI Centre Of Excellence
          </Badge>
          <h1 className="font-outfit font-black text-5xl md:text-7xl tracking-tight mb-6 leading-[0.95]">
            Supercharge your{" "}
            <span className="text-accent">AI Project</span>{" "}
            Development
          </h1>
          <p className="text-foreground/60 text-lg md:text-xl leading-relaxed mb-12 max-w-3xl mx-auto">
            A turnkey, state-of-the-art modular learning platform designed for students
            and researchers to leverage AI. ADVIT AI Labs includes Machine Learning &
            Deep Learning projects, Embedded Edge AI deployment on real-world industry
            AI projects & datasets, to develop state-of-the-art AI Research & Applications.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-accent text-white hover:bg-accent/90 font-bold px-10" onClick={() => scrollTo("contact")}>
              Subscribe <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="crisp-border font-bold px-10" onClick={() => scrollTo("products")}>
              Explore Products <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* CORE FEATURES */}
      <section id="features" className="py-24 px-6 border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-accent/10 text-accent border-accent/20 mb-4">Features</Badge>
            <h2 className="font-outfit font-black text-4xl md:text-5xl mb-4">Core Platform Features</h2>
            <p className="text-foreground/50 text-lg max-w-xl mx-auto">
              Everything you need to build, train, and deploy AI projects from scratch.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {coreFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.name} className="glass shadow-premium border-black/5 hover:shadow-2xl transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="bg-accent/10 rounded-2xl p-4 w-fit mx-auto mb-4">
                      <Icon className="w-7 h-7 text-accent" />
                    </div>
                    <h3 className="font-bold text-sm leading-snug">{f.name}</h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* VALUE ADD TO STUDENTS */}
      <section className="py-24 px-6 bg-black/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-accent/10 text-accent border-accent/20 mb-4">For Students & Researchers</Badge>
            <h2 className="font-outfit font-black text-4xl md:text-5xl mb-4">Value Add to Students</h2>
            <p className="text-foreground/50 text-lg max-w-xl mx-auto">
              Tools and infrastructure designed to accelerate learning and research.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {studentFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.name} className="glass border border-black/5 p-6 text-center hover:border-accent/30 hover:shadow-premium transition-all group">
                  <div className="bg-accent/10 rounded-xl p-3 w-fit mx-auto mb-3 group-hover:bg-accent/20 transition-colors">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-sm font-semibold text-foreground/70 group-hover:text-foreground transition-colors">{f.name}</p>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="crisp-border font-bold px-10" onClick={() => scrollTo("contact")}>
              Explore Pricing <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="py-24 px-6 border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-accent/10 text-accent border-accent/20 mb-4">Products</Badge>
            <h2 className="font-outfit font-black text-4xl md:text-5xl mb-4">Our Core Platforms</h2>
            <p className="text-foreground/50 text-lg max-w-xl mx-auto">
              Enterprise-grade AI platforms built to accelerate every stage of your machine learning lifecycle.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((p) => {
              const Icon = p.icon;
              return (
                <Card key={p.name} className="glass shadow-premium border-black/5 hover:shadow-2xl transition-all">
                  <CardContent className="p-8">
                    <div className="bg-accent/10 rounded-2xl p-4 w-fit mb-6">
                      <Icon className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-outfit font-black text-xl mb-1">{p.name}</h3>
                    <p className="text-accent text-sm font-semibold mb-3">{p.tagline}</p>
                    <p className="text-foreground/60 text-sm leading-relaxed mb-5">{p.description}</p>
                    <div className="grid grid-cols-2 gap-2 pt-4 border-t border-black/5">
                      {p.features.map((f) => (
                        <div key={f} className="text-xs text-foreground/50 flex items-center gap-1.5">
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

      {/* INDUSTRIES - FEATURED */}
      <section id="industries" className="py-24 px-6 bg-black/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-accent/10 text-accent border-accent/20 mb-4">AI Insights</Badge>
            <h2 className="font-outfit font-black text-4xl md:text-5xl mb-4">Industries We Serve</h2>
            <p className="text-foreground/50 text-lg max-w-xl mx-auto">
              Our AI platforms serve organizations across 11+ industries worldwide.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {industries.map((ind) => {
              const Icon = ind.icon;
              return (
                <Card key={ind.name} className="glass shadow-premium border-black/5 hover:shadow-2xl transition-all">
                  <CardContent className="p-8">
                    <div className="bg-accent/10 rounded-xl p-3 w-fit mb-5">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-outfit font-bold text-lg mb-2">{ind.name}</h3>
                    <p className="text-foreground/60 text-sm leading-relaxed">{ind.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* All 11 industries */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {allIndustries.map((ind) => {
              const Icon = ind.icon;
              return (
                <div key={ind.name} className="glass border border-black/5 p-5 text-center hover:border-accent/30 hover:shadow-premium transition-all group">
                  <div className="bg-accent/10 rounded-xl p-3 w-fit mx-auto mb-3 group-hover:bg-accent/20 transition-colors">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-xs font-semibold text-foreground/70 group-hover:text-foreground transition-colors">{ind.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 px-6 border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-accent/10 text-accent border-accent/20 mb-4">Services</Badge>
            <h2 className="font-outfit font-black text-4xl md:text-5xl mb-4">What We Offer</h2>
            <p className="text-foreground/50 text-lg max-w-xl mx-auto">
              End-to-end AI services to power your organization from data to deployment.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.name} className="glass shadow-premium border-black/5 hover:shadow-2xl transition-all">
                  <CardContent className="p-8">
                    <div className="bg-accent/10 rounded-xl p-3 w-fit mb-5">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-outfit font-bold text-lg mb-2">{s.name}</h3>
                    <p className="text-foreground/60 text-sm leading-relaxed">{s.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRICING TIERS */}
      <section className="py-24 px-6 bg-black/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-accent/10 text-accent border-accent/20 mb-4">Pricing</Badge>
            <h2 className="font-outfit font-black text-4xl md:text-5xl mb-4">
              Develop your AI Research Projects with ADVIT<span className="text-xs align-super">&trade;</span> AI Labs!
            </h2>
            <p className="text-foreground/50 text-lg max-w-xl mx-auto">
              Choose the plan that fits your needs. From individual researchers to full institutions.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { tier: "Students / Researchers", desc: "For individual learners and AI enthusiasts getting started with AI projects.", icon: GraduationCap },
              { tier: "Researchers Team", desc: "For collaborative research groups needing shared compute and project management.", icon: Users },
              { tier: "Educational Institute", desc: "Full institutional deployment with dedicated infrastructure and admin tools.", icon: Building2 },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <Card key={p.tier} className="glass shadow-premium border-black/5 hover:shadow-2xl transition-all">
                  <CardContent className="p-8 text-center">
                    <div className="bg-accent/10 rounded-full p-5 w-fit mx-auto mb-5">
                      <Icon className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-outfit font-black text-lg mb-2">{p.tier}</h3>
                    <p className="text-foreground/50 text-sm leading-relaxed mb-6">{p.desc}</p>
                    <Button className="bg-accent text-white hover:bg-accent/90 font-bold w-full" onClick={() => scrollTo("contact")}>
                      Get Started <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="py-24 px-6 border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-accent/10 text-accent border-accent/20 mb-4">Leadership</Badge>
            <h2 className="font-outfit font-black text-4xl md:text-5xl mb-4">Meet the Team</h2>
            <p className="text-foreground/50 text-lg max-w-xl mx-auto">
              The visionaries behind Automaton AI&apos;s mission to democratize artificial intelligence.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {founders.map((f) => (
              <Card key={f.name} className="glass shadow-premium border-black/5 hover:shadow-2xl transition-all">
                <CardContent className="p-8 text-center">
                  <div className="bg-accent/10 rounded-full p-5 w-fit mx-auto mb-5">
                    <Users className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-outfit font-black text-lg mb-1">{f.name}</h3>
                  <p className="text-accent text-sm font-semibold mb-3">{f.role}</p>
                  <p className="text-foreground/50 text-sm leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 px-6 bg-black/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-accent/10 text-accent border-accent/20 mb-4">Contact</Badge>
            <h2 className="font-outfit font-black text-4xl md:text-5xl mb-4">Get in Touch</h2>
            <p className="text-foreground/50 text-lg max-w-xl mx-auto">
              Ready to transform your business with AI? Let&apos;s talk.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="glass shadow-premium border-black/5">
              <CardContent className="p-8">
                <div className="bg-accent/10 rounded-xl p-3 w-fit mb-5">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-outfit font-bold text-lg mb-3">Headquarters</h3>
                <p className="text-foreground/60 text-sm leading-relaxed">
                  410, Suratwala Mark Plazzo,<br />
                  Hinjewadi Village, Hinjewadi,<br />
                  Pune, Maharashtra 411057, India
                </p>
              </CardContent>
            </Card>
            <Card className="glass shadow-premium border-black/5">
              <CardContent className="p-8">
                <div className="bg-accent/10 rounded-xl p-3 w-fit mb-5">
                  <Phone className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-outfit font-bold text-lg mb-4">Reach Us</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-accent shrink-0" />
                    <span className="text-foreground/60">India: +91 8698200400</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-accent shrink-0" />
                    <span className="text-foreground/60">US: +1 (669) 238-6880</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-accent shrink-0" />
                    <a href="mailto:info@automatonai.com" className="text-foreground/60 hover:text-accent transition-colors">info@automatonai.com</a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <ExternalLink className="w-4 h-4 text-accent shrink-0" />
                    <a href="https://automatonai.com" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-accent transition-colors">automatonai.com</a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-12">
            <a href="https://automatonai.com/join-ai-community/" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-accent text-white hover:bg-accent/90 font-bold px-10">
                Join AI Community <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src="/advit-labs-logo.png" alt="ADVIT AI Labs" className="w-10 h-10 object-contain" />
                <div className="font-outfit font-black text-lg">Automaton AI</div>
              </div>
              <p className="text-foreground/50 text-sm leading-relaxed mb-6">
                We are a full-stack AI company with a mission to democratize data.
              </p>
              <div className="flex items-center gap-3">
                <a href="https://www.linkedin.com/company/automaton-ai-infosystem-pvt-ltd" target="_blank" rel="noopener noreferrer" className="bg-accent/10 rounded-full p-2.5 hover:bg-accent/20 transition-colors">
                  <Linkedin className="w-4 h-4 text-accent" />
                </a>
                <a href="https://www.youtube.com/channel/UCg3IISI6jwjyUKKjOUZ0isA" target="_blank" rel="noopener noreferrer" className="bg-accent/10 rounded-full p-2.5 hover:bg-accent/20 transition-colors">
                  <Youtube className="w-4 h-4 text-accent" />
                </a>
                <a href="https://www.facebook.com/automatonai/" target="_blank" rel="noopener noreferrer" className="bg-accent/10 rounded-full p-2.5 hover:bg-accent/20 transition-colors">
                  <Facebook className="w-4 h-4 text-accent" />
                </a>
              </div>
            </div>

            {/* Products */}
            <div>
              <h4 className="font-bold text-sm mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-foreground/50">
                <li>ADVIT&trade; Studio</li>
                <li>ADAPT AI</li>
                <li>ADVIT&trade; AI Labs</li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-bold text-sm mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-foreground/50">
                <li>Data Labeling</li>
                <li>Custom AI Application</li>
                <li>Model Gallery</li>
                <li>AI Consultancy</li>
                <li>Data Zoo</li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold text-sm mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-foreground/50">
                <li>About Us</li>
                <li>Blogs</li>
                <li>Careers</li>
                <li>Privacy Policy</li>
                <li>Terms & Conditions</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-black/5 text-center">
            <p className="text-foreground/40 text-xs">
              &copy; {new Date().getFullYear()} Automaton AI Infosystem Pvt. Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
