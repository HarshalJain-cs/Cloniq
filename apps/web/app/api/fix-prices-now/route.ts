import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase";

export async function GET() {
  const supabase = createServiceRoleClient();

  // Update yield-aggregator to FREE
  const { data: yield1, error: error1 } = await supabase
    .from("agents")
    .update({ price_usdc: 0, is_free: true })
    .eq("name", "yield-aggregator")
    .select();

  // Update options-trader to FREE
  const { data: options1, error: error2 } = await supabase
    .from("agents")
    .update({ price_usdc: 0, is_free: true })
    .eq("name", "options-trader")
    .select();

  return NextResponse.json({
    yield_aggregator: error1 ? { error: error1.message } : { success: true, data: yield1 },
    options_trader: error2 ? { error: error2.message } : { success: true, data: options1 },
  });
}
