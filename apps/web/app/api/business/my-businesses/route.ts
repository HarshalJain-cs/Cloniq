import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get("wallet");

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // Find all businesses where user is owner or member
    const { data: memberBusinesses, error: memberError } = await supabase
      .from("business_members")
      .select("business_id")
      .eq("user_wallet", wallet.toLowerCase())
      .eq("status", "active");

    if (memberError) {
      console.error("Error fetching member businesses:", memberError);
    }

    const businessIds = memberBusinesses?.map((m) => m.business_id) || [];

    // Fetch businesses where user is owner OR a member
    const { data: businesses, error: businessError } = await supabase
      .from("businesses")
      .select("*")
      .or(
        `owner_wallet.eq.${wallet.toLowerCase()},id.in.(${businessIds.join(",")})`
      )
      .order("created_at", { ascending: false });

    if (businessError) {
      console.error("Error fetching businesses:", businessError);
      return NextResponse.json(
        { error: "Failed to fetch businesses" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      businesses: businesses || [],
    });
  } catch (error) {
    console.error("Business fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
