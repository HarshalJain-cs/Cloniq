"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Building2, Users, Bot, TrendingUp, Plus, ExternalLink, Globe } from "lucide-react";
import Link from "next/link";
import AdvitLabsServices from "@/components/business/AdvitLabsServices";

export default function BusinessSlugDashboard() {
  const params = useParams();
  const slug = params?.slug as string;
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch business data by slug
    const fetchBusiness = async () => {
      try {
        const response = await fetch(`/api/business/my-businesses?slug=${slug}`);
        const result = await response.json();
        if (result.businesses?.length > 0) {
          setBusiness(result.businesses[0]);
        } else {
          // Fallback mock data using slug
          setBusiness({
            business_name: slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
            slug,
            total_agents_created: 0,
            total_queries_this_month: 0,
            subscription_tier: "free",
          });
        }
      } catch {
        setBusiness({
          business_name: slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
          slug,
          total_agents_created: 0,
          total_queries_this_month: 0,
          subscription_tier: "free",
        });
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchBusiness();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 px-6 flex items-center justify-center">
        <div className="animate-pulse text-foreground/40">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-8 h-8 text-primary" />
            <h1 className="font-outfit font-black text-4xl">{business?.business_name}</h1>
            <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">
              {business?.subscription_tier || "free"}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-foreground/60">Manage your business agents and team</p>
            {slug === "automaton-ai" && (
              <Link href="/business/automaton-ai/website" className="inline-flex items-center gap-1 text-accent hover:underline text-sm font-medium">
                <Globe className="w-3.5 h-3.5" />
                View Demo Website
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
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

        {/* Demo Website Link */}
        {slug === "stoaa" && (
          <Card className="glass shadow-premium border-accent/20 mb-8">
            <CardContent className="p-8 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-2xl mb-1">Demo Website</h2>
                <p className="text-foreground/60 text-sm">
                  View your live Automaton AI demo website with conversational voice bot
                </p>
              </div>
              <Link href="/business/automaton-ai/website">
                <Button className="bg-accent text-white hover:bg-accent/90 font-bold px-8">
                  <Globe className="w-5 h-5 mr-2" />
                  View Demo Website
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

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
