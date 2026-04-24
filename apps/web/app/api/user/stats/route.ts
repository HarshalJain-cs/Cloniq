import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const walletAddress = request.nextUrl.searchParams.get("wallet");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // Get user stats using database function
    const { data: statsData, error: statsError } = await supabase.rpc(
      "get_user_stats",
      { wallet_address: walletAddress.toLowerCase() }
    );

    if (statsError) {
      console.error("[stats] Error fetching stats:", statsError);
    }

    const stats = statsData || {
      totalSpent: 0,
      totalQueries: 0,
      agentsUsed: 0,
      thisMonth: 0,
    };

    // Get recent chats (last 10)
    const { data: chatsData, error: chatsError } = await supabase.rpc(
      "get_recent_chats",
      { wallet_address: walletAddress.toLowerCase(), limit_count: 10 }
    );

    if (chatsError) {
      console.error("[stats] Error fetching chats:", chatsError);
    }

    const recentChats = chatsData || [];

    return NextResponse.json({
      stats,
      recentChats,
    });
  } catch (err) {
    console.error("[stats] Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
