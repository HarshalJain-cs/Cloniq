import { NextResponse, type NextRequest } from "next/server";
import { rateLimitByIP, RATE_LIMITS, withRateLimit } from "./lib/rate-limit";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limit agent query endpoints
  if (pathname.includes("/api/agents/") && pathname.includes("/ask")) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
               request.headers.get("x-real-ip") ||
               "unknown";

    // Apply rate limiting by IP
    const rateLimitResponse = await withRateLimit(
      request,
      RATE_LIMITS.AGENT_QUERY_FREE,
      ip
    );

    if (rateLimitResponse) {
      return rateLimitResponse; // Rate limit hit
    }
  }

  // Rate limit API key endpoints
  if (pathname.startsWith("/api/keys")) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    const rateLimitResponse = await withRateLimit(
      request,
      RATE_LIMITS.API_KEY_LIST,
      ip
    );

    if (rateLimitResponse) {
      return rateLimitResponse;
    }
  }

  // Rate limit payment endpoints
  if (pathname.startsWith("/api/topup")) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    const rateLimitResponse = await withRateLimit(
      request,
      RATE_LIMITS.TOPUP_CREATE,
      ip
    );

    if (rateLimitResponse) {
      return rateLimitResponse;
    }
  }

  // Rate limit WhatsApp webhook
  if (pathname === "/api/whatsapp") {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    const rateLimitResponse = await withRateLimit(
      request,
      RATE_LIMITS.WHATSAPP_MESSAGE,
      ip
    );

    if (rateLimitResponse) {
      return rateLimitResponse;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/agents/:path*/ask",
    "/api/agents/:path*/ask/stream",
    "/api/keys/:path*",
    "/api/topup/:path*",
    "/api/whatsapp",
    "/api/memory",
  ],
};
