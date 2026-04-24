"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  Clock,
  DollarSign,
  ArrowLeft,
  Download,
  Filter,
  Calendar,
  Radio,
} from "lucide-react";
import Link from "next/link";

const mockAnalytics = {
  totalConversations: 12847,
  activeUsers: 3421,
  avgResponseTime: "1.2s",
  revenue: "$8,742",
  satisfactionRate: 94,
  topAgents: [
    { name: "Customer Support AI", conversations: 4821, satisfaction: 96 },
    { name: "Sales Assistant", conversations: 3210, satisfaction: 92 },
    { name: "Tech Support Bot", conversations: 2816, satisfaction: 91 },
  ],
  conversationTrends: [
    { day: "Mon", count: 1820 },
    { day: "Tue", count: 2100 },
    { day: "Wed", count: 1950 },
    { day: "Thu", count: 2340 },
    { day: "Fri", count: 2150 },
    { day: "Sat", count: 1270 },
    { day: "Sun", count: 1217 },
  ],
};

export default function AnalyticsHub() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
                <h1 className="font-outfit font-black text-4xl">Agent Analytics Hub</h1>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                  <Radio className="w-3 h-3 mr-1 animate-pulse" />
                  Live
                </Badge>
              </div>
              <p className="text-foreground/60">Real-time insights & predictive analytics</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Last 7 Days
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              All Agents
            </Button>
            <Button variant="outline" size="sm" className="ml-auto">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass shadow-premium border-black/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <MessageSquare className="w-6 h-6 text-purple-500" />
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-1">{mockAnalytics.totalConversations.toLocaleString()}</div>
              <div className="text-sm text-foreground/60">Total Conversations</div>
              <div className="text-xs text-green-500 mt-1">+12% from last week</div>
            </CardContent>
          </Card>

          <Card className="glass shadow-premium border-black/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-6 h-6 text-blue-500" />
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-1">{mockAnalytics.activeUsers.toLocaleString()}</div>
              <div className="text-sm text-foreground/60">Active Users</div>
              <div className="text-xs text-green-500 mt-1">+8% from last week</div>
            </CardContent>
          </Card>

          <Card className="glass shadow-premium border-black/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-6 h-6 text-orange-500" />
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-1">{mockAnalytics.avgResponseTime}</div>
              <div className="text-sm text-foreground/60">Avg Response Time</div>
              <div className="text-xs text-green-500 mt-1">-15% from last week</div>
            </CardContent>
          </Card>

          <Card className="glass shadow-premium border-black/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-6 h-6 text-green-500" />
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-1">{mockAnalytics.revenue}</div>
              <div className="text-sm text-foreground/60">Revenue Generated</div>
              <div className="text-xs text-green-500 mt-1">+24% from last week</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversation Trends */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass shadow-premium border-black/5">
              <CardContent className="p-8">
                <h2 className="font-bold text-2xl mb-6">Conversation Trends</h2>
                <div className="h-64 flex items-end justify-between gap-2">
                  {mockAnalytics.conversationTrends.map((day, idx) => {
                    const maxCount = Math.max(...mockAnalytics.conversationTrends.map((d) => d.count));
                    const height = (day.count / maxCount) * 100;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg relative group cursor-pointer transition-all hover:opacity-80" style={{ height: `${height}%` }}>
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {day.count.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-xs text-foreground/60 font-medium">{day.day}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Agents */}
            <Card className="glass shadow-premium border-black/5">
              <CardContent className="p-8">
                <h2 className="font-bold text-2xl mb-6">Top Performing Agents</h2>
                <div className="space-y-4">
                  {mockAnalytics.topAgents.map((agent, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-background/50 rounded-xl border border-white/10">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center font-bold text-white">
                        #{idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium mb-1">{agent.name}</div>
                        <div className="text-xs text-foreground/60">{agent.conversations.toLocaleString()} conversations</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-500">{agent.satisfaction}%</div>
                        <div className="text-xs text-foreground/60">Satisfaction</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Satisfaction Score */}
            <Card className="glass shadow-premium border-black/5">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">User Satisfaction</h3>
                <div className="text-center mb-4">
                  <div className="text-6xl font-black bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-2">
                    {mockAnalytics.satisfactionRate}%
                  </div>
                  <div className="text-sm text-foreground/60">Overall Rating</div>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const percentage = stars === 5 ? 72 : stars === 4 ? 22 : stars === 3 ? 4 : stars === 2 ? 1 : 1;
                    return (
                      <div key={stars} className="flex items-center gap-2">
                        <div className="text-xs text-foreground/60 w-12">{stars} stars</div>
                        <div className="flex-1 h-2 bg-background/50 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <div className="text-xs text-foreground/60 w-10 text-right">{percentage}%</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Insights */}
            <Card className="glass shadow-premium border-black/5">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Quick Insights</h3>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="font-medium text-green-500">Peak Performance</span>
                    </div>
                    <p className="text-foreground/70">Thursday sees highest engagement (+24%)</p>
                  </div>

                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-blue-500">User Behavior</span>
                    </div>
                    <p className="text-foreground/70">Avg session duration: 8m 42s</p>
                  </div>

                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-4 h-4 text-purple-500" />
                      <span className="font-medium text-purple-500">Top Topic</span>
                    </div>
                    <p className="text-foreground/70">Product inquiries (42% of chats)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
