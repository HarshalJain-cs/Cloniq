import { NextResponse } from "next/server";
import { seedDemoAgents } from "@/lib/seed-demo-agents";

export const dynamic = "force-dynamic";

/**
 * Auto-seed endpoint
 * Call this once to create the 5 demo agents automatically
 *
 * Usage: GET /api/seed
 */
export async function GET() {
  try {
    const result = await seedDemoAgents();

    if (!result.seeded) {
      return NextResponse.json({
        message: "Demo agents already exist",
        existing: result.existing,
      });
    }

    return NextResponse.json({
      message: "Demo agents seeded successfully",
      results: result.results,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
