"use client";

import { useActiveAccount } from "thirdweb/react";
import { motion } from "framer-motion";
import {
  Activity,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Calendar,
  Bot,
  Wallet,
  ArrowUpRight,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const account = useActiveAccount();
  const [stats, setStats] = useState({
    totalSpent: 0,
    totalQueries: 0,
    agentsUsed: 0,
    thisMonth: 0,
  });
  const [recentChats, setRecentChats] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Fetch real data from API
    // For now, using mock data
    setStats({
      totalSpent: 12.45,
      totalQueries: 87,
      agentsUsed: 5,
      thisMonth: 3.20,
    });

    setRecentChats([
      {
        id: "1",
        agentName: "blockchain-dev",
        message: "How do I implement ERC-6551 token bound accounts?",
        timestamp: new Date(Date.now() - 3600000),
        cost: 0.02,
      },
      {
        id: "2",
        agentName: "legal-advisor",
        message: "What are the legal requirements for launching a DAO?",
        timestamp: new Date(Date.now() - 7200000),
        cost: 0.05,
      },
      {
        id: "3",
        agentName: "fitness-coach",
        message: "Create a workout plan for muscle building",
        timestamp: new Date(Date.now() - 86400000),
        cost: 0,
      },
    ]);
  }, [account]);

  if (!account) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
        <Card className="glass shadow-premium border-black/5 max-w-md">
          <CardContent className="p-10 text-center">
            <Wallet size={48} className="mx-auto mb-4 text-primary" />
            <h2 className="font-outfit font-black text-2xl mb-2">Connect Your Wallet</h2>
            <p className="text-foreground/60 text-sm">
              Connect your wallet to view your dashboard and chat history.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="accent" className="px-4 py-1">
              Your Dashboard
            </Badge>
          </div>
          <h1 className="font-outfit font-black text-5xl tracking-tight text-foreground mb-4">
            Activity <span className="text-primary italic">Overview</span>
          </h1>
          <p className="text-foreground/60 font-medium max-w-2xl">
            Track your agent interactions, spending, and usage across the Cloniq network.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <Card className="glass shadow-premium border-black/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <DollarSign size={24} />
                </div>
                <TrendingUp size={16} className="text-green-500" />
              </div>
              <h3 className="text-3xl font-black mb-1">${stats.totalSpent.toFixed(2)}</h3>
              <p className="text-xs text-foreground/50 font-medium">Total Spent</p>
              <p className="text-[10px] text-green-600 font-bold mt-2">
                +${stats.thisMonth.toFixed(2)} this month
              </p>
            </CardContent>
          </Card>

          <Card className="glass shadow-premium border-black/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <MessageSquare size={24} />
                </div>
              </div>
              <h3 className="text-3xl font-black mb-1">{stats.totalQueries}</h3>
              <p className="text-xs text-foreground/50 font-medium">Total Queries</p>
              <p className="text-[10px] text-foreground/30 font-bold mt-2">
                Across all agents
              </p>
            </CardContent>
          </Card>

          <Card className="glass shadow-premium border-black/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                  <Bot size={24} />
                </div>
              </div>
              <h3 className="text-3xl font-black mb-1">{stats.agentsUsed}</h3>
              <p className="text-xs text-foreground/50 font-medium">Agents Used</p>
              <p className="text-[10px] text-foreground/30 font-bold mt-2">
                Different agents
              </p>
            </CardContent>
          </Card>

          <Card className="glass shadow-premium border-black/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                  <Activity size={24} />
                </div>
              </div>
              <h3 className="text-3xl font-black mb-1">{recentChats.length}</h3>
              <p className="text-xs text-foreground/50 font-medium">Recent Chats</p>
              <p className="text-[10px] text-foreground/30 font-bold mt-2">
                Last 7 days
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Chat History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-outfit font-black text-2xl">Recent Conversations</h2>
            <Button variant="outline" size="sm">
              View All
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <Card className="glass shadow-premium border-black/5">
            <CardContent className="p-0">
              {recentChats.length === 0 ? (
                <div className="p-12 text-center">
                  <MessageSquare size={48} className="mx-auto mb-4 text-foreground/20" />
                  <h3 className="font-bold text-lg mb-2">No conversations yet</h3>
                  <p className="text-sm text-foreground/50 mb-6">
                    Start chatting with an agent to see your history here.
                  </p>
                  <Link href="/browse">
                    <Button>Browse Agents</Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-black/5">
                  {recentChats.map((chat, index) => (
                    <motion.div
                      key={chat.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="p-6 hover:bg-black/[0.02] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white shrink-0">
                          <Bot size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-sm">@{chat.agentName}</h4>
                            <Badge variant="glass" className="text-[10px]">
                              {chat.cost === 0 ? "FREE" : `$${chat.cost.toFixed(2)}`}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground/70 mb-2 truncate">
                            {chat.message}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-foreground/40">
                            <Clock size={12} />
                            <span>{formatTimestamp(chat.timestamp)}</span>
                          </div>
                        </div>
                        <Link href={`/agent/${chat.agentName}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Continue
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
