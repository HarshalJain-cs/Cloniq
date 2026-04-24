import { NextRequest, NextResponse } from "next/server";
import { scrapeTwitterProfile, scrapeTwitterProfileRapidAPI } from "@/lib/twitter-scraper";

export const dynamic = "force-dynamic";

/**
 * POST /api/twitter/scrape
 * Scrape Twitter profile to extract personality
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body.username !== "string") {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const { username } = body;

    // Validate username
    const cleanUsername = username.trim().replace(/^@/, "");
    if (!cleanUsername || cleanUsername.length === 0) {
      return NextResponse.json(
        { error: "Invalid username" },
        { status: 400 }
      );
    }

    // Use official Twitter API v2
    let scrapedData;
    let source = "twitter-api-v2";

    try {
      scrapedData = await scrapeTwitterProfile(cleanUsername);
    } catch (error: any) {
      console.error("[Twitter Scrape] Failed:", error.message);
      return NextResponse.json(
        {
          error: "Failed to scrape Twitter profile. " + error.message,
          details: error.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      source,
      data: {
        username: scrapedData.user.username,
        name: scrapedData.user.name,
        bio: scrapedData.user.description,
        followers: scrapedData.user.public_metrics?.followers_count,
        tweet_count: scrapedData.tweets.length,
        personality_summary: scrapedData.personality_summary,
      },
    });
  } catch (error: any) {
    console.error("[POST /api/twitter/scrape] Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
