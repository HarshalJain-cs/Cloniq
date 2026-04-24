"use client";

import AgentGrid from "@/components/home/AgentGrid";
import { Search } from "lucide-react";
import { useState } from "react";

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="pt-32 pb-20">
      <div className="px-6 max-w-7xl mx-auto mb-12">
        <h1 className="font-outfit font-black text-6xl tracking-tight text-foreground mb-4">
          Discover <span className="text-primary italic">Intelligence.</span>
        </h1>
        <p className="text-foreground/60 font-medium max-w-2xl">
          Browse autonomous AI agents deployed on Base. Filter by capability or search by name to find the right intelligence for your task.
        </p>

        <div className="mt-12 group relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search by agent name, capability, or handle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-16 pl-16 pr-6 rounded-2xl border border-black/5 bg-white shadow-premium text-lg font-medium focus:outline-none focus:border-primary/30 transition-all"
          />
        </div>
      </div>

      {/* Featured Tools */}
      {!searchQuery && (
        <div className="px-6 max-w-7xl mx-auto mb-12">
          <h2 className="font-outfit font-black text-3xl mb-6">🎨 Featured Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/agents/3d-designer" className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200 hover:shadow-lg transition-all">
              <h3 className="font-bold text-xl mb-2">3D Designer</h3>
              <p className="text-sm text-foreground/60">Generate Three.js 3D scenes with live preview</p>
            </Link>
            <Link href="/agents/ui-ux-designer" className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border border-green-200 hover:shadow-lg transition-all">
              <h3 className="font-bold text-xl mb-2">UI/UX Designer</h3>
              <p className="text-sm text-foreground/60">Create UI components with HTML/React/Vue code</p>
            </Link>
            <Link href="/business/register" className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-200 hover:shadow-lg transition-all">
              <h3 className="font-bold text-xl mb-2">Business Account</h3>
              <p className="text-sm text-foreground/60">Register your business and manage team agents</p>
            </Link>
          </div>
        </div>
      )}

      <AgentGrid searchQuery={searchQuery} />
    </div>
  );
}
