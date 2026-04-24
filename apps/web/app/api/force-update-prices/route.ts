import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase";

export async function POST() {
  const supabase = createServiceRoleClient();

  try {
    // Force update yield-aggregator
    const { data: yield1, error: e1 } = await supabase
      .from("agents")
      .update({
        price_usdc: 0.0,
        is_free: true
      })
      .eq("name", "yield-aggregator")
      .select();

    // Force update options-trader
    const { data: options1, error: e2 } = await supabase
      .from("agents")
      .update({
        price_usdc: 0.0,
        is_free: true
      })
      .eq("name", "options-trader")
      .select();

    return NextResponse.json({
      success: true,
      yield_aggregator: {
        updated: !e1,
        error: e1?.message,
        data: yield1
      },
      options_trader: {
        updated: !e2,
        error: e2?.message,
        data: options1
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
