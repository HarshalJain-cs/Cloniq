"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Brain,
  Upload,
  Database,
  Zap,
  CheckCircle,
  ArrowLeft,
  FileText,
  Radio,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function TrainingSuite() {
  const [uploadProgress, setUploadProgress] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/business/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#3F51B5] to-[#1A237E] rounded-2xl blur-xl opacity-60 animate-pulse"></div>
              <div className="relative bg-[#3F51B5]/20 backdrop-blur-xl border border-[#3F51B5]/30 rounded-2xl p-4">
                <img
                  src="/advit-labs-logo.png"
                  alt="ADVIT AI Labs"
                  className="w-12 h-12 object-contain"
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-outfit font-black text-4xl">Enterprise Training Suite</h1>
                <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                  <Radio className="w-3 h-3 mr-1 animate-pulse" />
                  Beta
                </Badge>
              </div>
              <p className="text-foreground/60">Fine-tune agents on your proprietary data</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Section */}
            <Card className="glass shadow-premium border-black/5">
              <CardContent className="p-8">
                <h2 className="font-bold text-2xl mb-6">Upload Training Data</h2>
                <div className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-primary/50 transition-all cursor-pointer group">
                  <Upload className="w-16 h-16 mx-auto mb-4 text-foreground/40 group-hover:text-primary transition-colors" />
                  <h3 className="font-bold text-xl mb-2">Drop files here or click to browse</h3>
                  <p className="text-foreground/60 mb-4">
                    Supports: PDF, DOCX, TXT, CSV, JSON, Markdown
                  </p>
                  <Button className="bg-gradient-to-r from-orange-500 to-pink-500">
                    <FileText className="w-4 h-4 mr-2" />
                    Select Files
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Training Models */}
            <Card className="glass shadow-premium border-black/5">
              <CardContent className="p-8">
                <h2 className="font-bold text-2xl mb-6">Training Models</h2>
                <div className="space-y-4">
                  {[
                    { name: "GPT-4 Fine-tune", status: "Ready", accuracy: 94 },
                    { name: "Custom Domain Model", status: "Training", accuracy: 87 },
                    { name: "Industry Specific", status: "Queued", accuracy: 0 },
                  ].map((model, idx) => (
                    <div key={idx} className="p-4 bg-background/50 rounded-xl border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{model.name}</div>
                        <Badge variant={model.status === "Ready" ? "default" : "outline"}>
                          {model.status}
                        </Badge>
                      </div>
                      {model.accuracy > 0 && (
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-orange-500 to-pink-500" style={{ width: `${model.accuracy}%` }}></div>
                          </div>
                          <div className="text-sm font-medium">{model.accuracy}%</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Stats */}
            <Card className="glass shadow-premium border-black/5">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Training Stats</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-foreground/60">Documents Processed</span>
                      <span className="font-bold">1,247</span>
                    </div>
                    <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-pink-500" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-foreground/60">Training Accuracy</span>
                      <span className="font-bold text-green-500">94%</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-foreground/60">Active Models</span>
                      <span className="font-bold">3</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="glass shadow-premium border-black/5">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Features</h3>
                <div className="space-y-3 text-sm">
                  {[
                    "Custom model fine-tuning",
                    "RAG (Retrieval Augmented Generation)",
                    "Knowledge base versioning",
                    "Continuous learning",
                    "Data privacy controls",
                    "Multi-language support",
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-foreground/70">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
