"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Palette, Layout, Download, Copy, Check, Sparkles, Smartphone } from "lucide-react";

type ComponentType = "button" | "card" | "navbar" | "form" | "hero" | "footer";
type StyleType = "modern" | "glassmorphism" | "neumorphism" | "minimalist" | "brutalist";

interface DesignResult {
  success: boolean;
  design: {
    component: string;
    style: string;
    colors: {
      primary: string;
      secondary: string;
      background: string;
    };
    code: {
      html: string;
      react: string;
      vue: string;
    };
    preview: {
      html: string;
      dataUrl: string;
    };
  };
  message: string;
}

export default function UIUXDesignerPage() {
  const [componentType, setComponentType] = useState<ComponentType>("button");
  const [styleType, setStyleType] = useState<StyleType>("modern");
  const [colors, setColors] = useState({
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    background: "#ffffff",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [designResult, setDesignResult] = useState<DesignResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [codeTab, setCodeTab] = useState<"html" | "react" | "vue">("html");

  const handleGenerate = async () => {
    setIsGenerating(true);
    setDesignResult(null);

    try {
      const response = await fetch("/api/agents/ui-ux-designer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          component: componentType,
          style: styleType,
          colors,
          preview: true,
        }),
      });

      const result: DesignResult = await response.json();
      if (result.success) {
        setDesignResult(result);
      } else {
        console.error("Generation failed:", result);
      }
    } catch (error) {
      console.error("Failed to generate UI component:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = () => {
    if (designResult?.design.code[codeTab]) {
      navigator.clipboard.writeText(designResult.design.code[codeTab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (designResult?.design.preview.html) {
      const blob = new Blob([designResult.design.preview.html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${componentType}-${styleType}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const COMPONENTS: { value: ComponentType; label: string }[] = [
    { value: "button", label: "Button" },
    { value: "card", label: "Card" },
    { value: "navbar", label: "Navbar" },
    { value: "form", label: "Form" },
    { value: "hero", label: "Hero" },
    { value: "footer", label: "Footer" },
  ];

  const STYLES: { value: StyleType; label: string }[] = [
    { value: "modern", label: "Modern" },
    { value: "glassmorphism", label: "Glass" },
    { value: "neumorphism", label: "Neomorphic" },
    { value: "minimalist", label: "Minimal" },
    { value: "brutalist", label: "Brutalist" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <Badge variant="accent" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            UI/UX Designer Agent
          </Badge>
          <h1 className="font-outfit font-black text-6xl tracking-tight text-foreground mb-4">
            Design <span className="text-primary italic">Components</span>
          </h1>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            Generate beautiful, production-ready UI components with customizable styles and colors.
            Get HTML, React, and Vue code instantly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass shadow-premium border-black/5 h-full">
              <CardContent className="p-8">
                <h2 className="font-bold text-2xl mb-6 flex items-center gap-2">
                  <Layout className="w-6 h-6 text-primary" />
                  Component Configuration
                </h2>

                {/* Component Type Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-foreground/60 mb-3">
                    Component Type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {COMPONENTS.map((comp) => (
                      <button
                        key={comp.value}
                        onClick={() => setComponentType(comp.value)}
                        className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                          componentType === comp.value
                            ? "bg-primary text-white shadow-lg"
                            : "bg-white/50 border border-black/10 hover:border-primary/30"
                        }`}
                      >
                        {comp.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style Type Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-foreground/60 mb-3">
                    Design Style
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {STYLES.map((style) => (
                      <button
                        key={style.value}
                        onClick={() => setStyleType(style.value)}
                        className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                          styleType === style.value
                            ? "bg-primary text-white shadow-lg"
                            : "bg-white/50 border border-black/10 hover:border-primary/30"
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Pickers */}
                <div className="mb-8">
                  <label className="block text-sm font-bold text-foreground/60 mb-3 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Color Palette
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-foreground/50 mb-2">Primary</label>
                      <div className="relative">
                        <input
                          type="color"
                          value={colors.primary}
                          onChange={(e) =>
                            setColors((prev) => ({ ...prev, primary: e.target.value }))
                          }
                          className="w-full h-12 rounded-lg cursor-pointer border border-black/10"
                        />
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-1 text-[10px] text-foreground/40 font-mono">
                          {colors.primary}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-foreground/50 mb-2">Secondary</label>
                      <div className="relative">
                        <input
                          type="color"
                          value={colors.secondary}
                          onChange={(e) =>
                            setColors((prev) => ({ ...prev, secondary: e.target.value }))
                          }
                          className="w-full h-12 rounded-lg cursor-pointer border border-black/10"
                        />
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-1 text-[10px] text-foreground/40 font-mono">
                          {colors.secondary}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-foreground/50 mb-2">Background</label>
                      <div className="relative">
                        <input
                          type="color"
                          value={colors.background}
                          onChange={(e) =>
                            setColors((prev) => ({ ...prev, background: e.target.value }))
                          }
                          className="w-full h-12 rounded-lg cursor-pointer border border-black/10"
                        />
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-1 text-[10px] text-foreground/40 font-mono">
                          {colors.background}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full h-14 text-base font-bold"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                      />
                      Generating Component...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Component
                    </>
                  )}
                </Button>

                {/* Action Buttons */}
                {designResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 grid grid-cols-2 gap-3"
                  >
                    <Button variant="outline" onClick={handleCopyCode} className="flex items-center justify-center gap-2">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied!" : "Copy Code"}
                    </Button>
                    <Button variant="outline" onClick={handleDownload} className="flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Download HTML
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Preview Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass shadow-premium border-black/5 h-full">
              <CardContent className="p-8">
                <h2 className="font-bold text-2xl mb-6">Live Preview</h2>

                <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-black/10 relative">
                  {designResult ? (
                    <iframe
                      srcDoc={designResult.design.preview.html}
                      className="w-full h-full"
                      title="UI Component Preview"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground/40">
                      <Smartphone className="w-16 h-16 mb-4" />
                      <p className="font-medium">Configure component and click generate</p>
                      <p className="text-sm mt-1">Your UI preview will appear here</p>
                    </div>
                  )}
                </div>

                {designResult && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20"
                  >
                    <p className="text-xs text-primary font-medium">
                      ✨ {designResult.message}
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Code Preview (if generated) */}
        {designResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Card className="glass shadow-premium border-black/5">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-2xl">Generated Code</h2>
                  <div className="flex gap-2">
                    {(["html", "react", "vue"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setCodeTab(tab)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          codeTab === tab
                            ? "bg-primary text-white"
                            : "bg-white/50 border border-black/10 hover:border-primary/30"
                        }`}
                      >
                        {tab.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-black/90 rounded-lg p-6 overflow-x-auto max-h-96">
                  <pre className="text-green-400 text-sm font-mono">
                    <code>{designResult.design.code[codeTab]}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
