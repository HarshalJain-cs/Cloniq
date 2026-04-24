import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase";

export async function POST() {
  const supabase = createServiceRoleClient();

  // Update yield-aggregator and options-trader to FREE
  const updates = [
    { name: "yield-aggregator", price_usdc: 0, is_free: true },
    { name: "options-trader", price_usdc: 0, is_free: true },
  ];

  const results = [];

  for (const update of updates) {
    const { data, error } = await supabase
      .from("agents")
      .update({ price_usdc: update.price_usdc, is_free: update.is_free })
      .eq("name", update.name)
      .select();

    if (error) {
      results.push({ agent: update.name, status: "error", error: error.message });
    } else {
      results.push({ agent: update.name, status: "updated", price: update.price_usdc });
    }
  }

  return NextResponse.json({ results });
}
