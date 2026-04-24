import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase";

export async function POST() {
  const supabase = createServiceRoleClient();

  const agents = [
    {
      name: "yield-aggregator",
      description: "DeFi yield aggregator that finds the best stablecoin APYs across Aave, Moonwell, Seamless, and other protocols on Base. Automatically deposits user funds into highest-yielding safe protocols. Real-time yield comparison and auto-compounding. Can accept deposits and execute real on-chain investments.",
      skill_tags: ["DeFi", "Yield", "Aave", "Staking", "APY", "Automation", "Base"],
      price_usdc: 0.03,
      is_free: false,
      status: "active",
      owner_address: "0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e",
      owner_wallet: "0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e",
      wallet_address: "0x8B9C0D1E2F3456789012345678901234567890DEF",
      endpoint_url: "/api/agents/yield-aggregator",
    },
    {
      name: "options-trader",
      description: "Automated options trading agent that executes leveraged call/put options on Ethereum and Base. Trades on Lyra Protocol with real-time quotes. Takes user funds and executes trades on their behalf using smart contract automation. Can buy/sell calls and puts with capped downside risk.",
      skill_tags: ["Options", "Trading", "Leverage", "DeFi", "Lyra", "Automation"],
      price_usdc: 0.05,
      is_free: false,
      status: "active",
      owner_address: "0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e",
      owner_wallet: "0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e",
      wallet_address: "0x9A0B1C2D3E4F5678901234567890123456789ABC",
      endpoint_url: "/api/agents/options-trader",
    },
  ];

  const results = [];

  for (const agent of agents) {
    // Check if exists
    const { data: existing } = await supabase
      .from("agents")
      .select("id")
      .eq("name", agent.name)
      .single();

    if (existing) {
      results.push({ agent: agent.name, status: "already exists", id: existing.id });
      continue;
    }

    // Insert
    const { data, error } = await supabase
      .from("agents")
      .insert(agent)
      .select()
      .single();

    if (error) {
      results.push({ agent: agent.name, status: "error", error: error.message });
    } else {
      results.push({ agent: agent.name, status: "created", id: data.id });
    }
  }

  return NextResponse.json({ results });
}
