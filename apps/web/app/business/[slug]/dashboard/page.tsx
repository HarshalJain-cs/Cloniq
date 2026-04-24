"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Building2, Users, Bot, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";
import AdvitLabsServices from "@/components/business/AdvitLabsServices";

export default function BusinessDashboard() {
  const params = useParams();
  const slug = params.slug as string;
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch business data
    // For now, mock data
    setBusiness({
      business_name: slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
      total_agents_created: 5,
      total_queries_this_month: 1247,
      subscription_tier: "free",
    });
    setLoading(false);
  }, [slug]);

  if (loading) return <div className="min-h-screen pt-32 px-6 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-8 h-8 text-primary" />
            <h1 className="font-outfit font-black text-4xl">{business?.business_name}</h1>
          </div>
          <p className="text-foreground/60">Manage your business agents and team</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass shadow-premium border-black/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Bot className="w-8 h-8 text-primary" />
                <span className="text-3xl font-bold">{business?.total_agents_created || 0}</span>
              </div>
              <p className="text-sm text-foreground/60">Active Agents</p>
            </CardContent>
          </Card>

          <Card className="glass shadow-premium border-black/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <span className="text-3xl font-bold">{business?.total_queries_this_month || 0}</span>
              </div>
              <p className="text-sm text-foreground/60">Queries This Month</p>
            </CardContent>
          </Card>

          <Card className="glass shadow-premium border-black/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-blue-600" />
                <span className="text-3xl font-bold">1</span>
              </div>
              <p className="text-sm text-foreground/60">Team Members</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="glass shadow-premium border-black/5">
            <CardContent className="p-8">
              <h2 className="font-bold text-2xl mb-4">Business Agents</h2>
              <p className="text-foreground/60 mb-6">
                Deploy agents for your business. Choose visibility: Private, Team, or Public.
              </p>
              <Link href="/create">
                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Deploy Business Agent
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="glass shadow-premium border-black/5">
            <CardContent className="p-8">
              <h2 className="font-bold text-2xl mb-4">Team Management</h2>
              <p className="text-foreground/60 mb-6">
                Invite team members and manage roles. Collaborate on agent development.
              </p>
              <Button variant="outline" className="w-full" disabled>
                <Users className="w-4 h-4 mr-2" />
                Manage Team (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* ADVIT AI Labs Services */}
        <AdvitLabsServices />
      </div>
    </div>
  );
}
