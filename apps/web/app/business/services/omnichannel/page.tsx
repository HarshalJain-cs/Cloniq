"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Globe2,
  MessageCircle,
  Smartphone,
  Radio,
  CheckCircle,
  ArrowLeft,
  Plus,
  Settings,
} from "lucide-react";
import Link from "next/link";

const channels = [
  {
    id: "web",
    name: "Web Widget",
    icon: "🌐",
    status: "active",
    conversations: 4821,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    icon: "💬",
    status: "active",
    conversations: 3210,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "telegram",
    name: "Telegram Bot",
    icon: "✈️",
    status: "active",
    conversations: 2156,
    color: "from-blue-400 to-blue-600",
  },
  {
    id: "slack",
    name: "Slack App",
    icon: "💼",
    status: "inactive",
    conversations: 0,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "discord",
    name: "Discord Bot",
    icon: "🎮",
    status: "inactive",
    conversations: 0,
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "mobile",
    name: "Mobile App SDK",
    icon: "📱",
    status: "inactive",
    conversations: 0,
    color: "from-orange-500 to-red-500",
  },
];

export default function OmnichannelDeployment() {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

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
                <h1 className="font-outfit font-black text-4xl">Omnichannel Deployment</h1>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                  <Radio className="w-3 h-3 mr-1 animate-pulse" />
                  Live
                </Badge>
              </div>
              <p className="text-foreground/60">Deploy agents across 15+ platforms</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Channels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {channels.map((channel) => (
                <Card
                  key={channel.id}
                  className={`group glass shadow-premium transition-all hover:scale-[1.02] cursor-pointer ${
                    selectedChannel === channel.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedChannel(channel.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-5xl">{channel.icon}</div>
                      <Badge variant={channel.status === "active" ? "default" : "outline"}>
                        {channel.status === "active" ? (
                          <>
                            <Radio className="w-3 h-3 mr-1 animate-pulse" />
                            Active
                          </>
                        ) : (
                          "Inactive"
                        )}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-xl mb-2">{channel.name}</h3>
                    {channel.status === "active" ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground/60">Conversations</span>
                          <span className="font-bold">{channel.conversations.toLocaleString()}</span>
                        </div>
                        <Button variant="outline" className="w-full" size="sm">
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className={`w-full bg-gradient-to-r ${channel.color} hover:opacity-90`}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Activate Channel
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Unified Dashboard */}
            <Card className="glass shadow-premium border-black/5">
              <CardContent className="p-8">
                <h2 className="font-bold text-2xl mb-6">Unified Conversation History</h2>
                <div className="space-y-3">
                  {[
                    { channel: "WhatsApp", user: "John Doe", message: "When can I expect my order?", time: "2m ago", icon: "💬" },
                    { channel: "Web", user: "Sarah Miller", message: "How do I reset my password?", time: "5m ago", icon: "🌐" },
                    { channel: "Telegram", user: "Mike Johnson", message: "Thanks for the help!", time: "12m ago", icon: "✈️" },
                  ].map((conv, idx) => (
                    <div key={idx} className="p-4 bg-background/50 rounded-xl border border-white/10 hover:border-white/20 transition-all cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-2xl">{conv.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium">{conv.user}</div>
                          <div className="text-xs text-foreground/60">{conv.channel}</div>
                        </div>
                        <div className="text-xs text-foreground/40">{conv.time}</div>
                      </div>
                      <p className="text-sm text-foreground/70">{conv.message}</p>
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
                <h3 className="font-bold text-lg mb-4">Channel Statistics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-foreground/60">Total Channels</span>
                      <span className="font-bold">6</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-foreground/60">Active Channels</span>
                      <span className="font-bold text-green-500">3</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-foreground/60">Total Conversations</span>
                      <span className="font-bold">10,187</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-foreground/60">Avg Response Time</span>
                      <span className="font-bold">1.8s</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="glass shadow-premium border-black/5">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Platform Features</h3>
                <div className="space-y-3 text-sm">
                  {[
                    "One-click deployment",
                    "Unified inbox",
                    "Cross-platform analytics",
                    "Custom webhook integrations",
                    "Auto-routing",
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

            {/* Available Channels */}
            <Card className="glass shadow-premium border-black/5">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Available Integrations</h3>
                <div className="flex flex-wrap gap-2">
                  {["Facebook", "Instagram", "Twitter", "LINE", "WeChat", "Viber", "SMS", "Email", "API"].map((platform) => (
                    <Badge key={platform} variant="outline" className="text-xs">
                      {platform}
                    </Badge>
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
