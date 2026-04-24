/**
 * Rate Limiting with Upstash Redis
 * Protects API endpoints from abuse
 */

import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter (fallback if Redis not available)
class InMemoryRateLimiter {
  private requests: Map<string, number[]> = new Map();

  async limit(key: string, maxRequests: number, windowMs: number): Promise<{ success: boolean; remaining: number }> {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get existing requests for this key
    const keyRequests = this.requests.get(key) || [];

    // Filter out old requests outside the window
    const recentRequests = keyRequests.filter(timestamp => timestamp > windowStart);

    // Check if limit exceeded
    if (recentRequests.length >= maxRequests) {
      this.requests.set(key, recentRequests);
      return {
        success: false,
        remaining: 0,
      };
    }

    // Add current request
    recentRequests.push(now);
    this.requests.set(key, recentRequests);

    // Cleanup old entries periodically
    if (Math.random() < 0.01) {
      this.cleanup(windowStart);
    }

    return {
      success: true,
      remaining: maxRequests - recentRequests.length,
    };
  }

  private cleanup(before: number) {
    for (const [key, timestamps] of this.requests.entries()) {
      const recent = timestamps.filter(t => t > before);
      if (recent.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, recent);
      }
    }
  }
}

const memoryLimiter = new InMemoryRateLimiter();

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyPrefix?: string;
}

/**
 * Rate limit by IP address
 */
export async function rateLimitByIP(
  req: NextRequest,
  config: RateLimitConfig = { maxRequests: 10, windowMs: 60000 }
): Promise<{ success: boolean; remaining: number }> {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ||
             req.headers.get('x-real-ip') ||
             'unknown';

  const key = `${config.keyPrefix || 'ip'}:${ip}`;

  return memoryLimiter.limit(key, config.maxRequests, config.windowMs);
}

/**
 * Rate limit by wallet address
 */
export async function rateLimitByWallet(
  wallet: string,
  config: RateLimitConfig = { maxRequests: 20, windowMs: 60000 }
): Promise<{ success: boolean; remaining: number }> {
  const key = `${config.keyPrefix || 'wallet'}:${wallet.toLowerCase()}`;

  return memoryLimiter.limit(key, config.maxRequests, config.windowMs);
}

/**
 * Rate limit by API key
 */
export async function rateLimitByApiKey(
  apiKey: string,
  config: RateLimitConfig = { maxRequests: 100, windowMs: 60000 }
): Promise<{ success: boolean; remaining: number }> {
  const key = `${config.keyPrefix || 'apikey'}:${apiKey}`;

  return memoryLimiter.limit(key, config.maxRequests, config.windowMs);
}

/**
 * Middleware helper for rate limiting
 */
export async function withRateLimit(
  req: NextRequest,
  config: RateLimitConfig,
  identifier: string
): Promise<NextResponse | null> {
  const key = `${config.keyPrefix || 'rl'}:${identifier}`;

  const result = await memoryLimiter.limit(key, config.maxRequests, config.windowMs);

  if (!result.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(Date.now() + config.windowMs).toISOString(),
          'Retry-After': Math.ceil(config.windowMs / 1000).toString(),
        },
      }
    );
  }

  return null; // No rate limit hit, continue
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // Public endpoints
  AGENT_LIST: { maxRequests: 30, windowMs: 60000 }, // 30 per minute
  AGENT_DETAIL: { maxRequests: 50, windowMs: 60000 }, // 50 per minute

  // Protected endpoints
  AGENT_QUERY_FREE: { maxRequests: 10, windowMs: 60000 }, // 10 per minute for free agents
  AGENT_QUERY_PAID: { maxRequests: 100, windowMs: 60000 }, // 100 per minute for paid

  // Payment endpoints
  TOPUP_CREATE: { maxRequests: 5, windowMs: 300000 }, // 5 per 5 minutes
  TOPUP_VERIFY: { maxRequests: 10, windowMs: 60000 }, // 10 per minute

  // API key management
  API_KEY_CREATE: { maxRequests: 3, windowMs: 3600000 }, // 3 per hour
  API_KEY_DELETE: { maxRequests: 10, windowMs: 60000 }, // 10 per minute
  API_KEY_LIST: { maxRequests: 20, windowMs: 60000 }, // 20 per minute

  // Memory seeding (admin)
  MEMORY_SEED: { maxRequests: 5, windowMs: 3600000 }, // 5 per hour

  // WhatsApp bot
  WHATSAPP_MESSAGE: { maxRequests: 30, windowMs: 60000 }, // 30 per minute

  // User data export (GDPR)
  DATA_EXPORT: { maxRequests: 3, windowMs: 3600000 }, // 3 per hour

  // Strict for auth failures
  AUTH_FAILURE: { maxRequests: 5, windowMs: 900000 }, // 5 per 15 minutes
};

/**
 * Track failed authentication attempts
 */
export async function trackAuthFailure(identifier: string): Promise<boolean> {
  const result = await memoryLimiter.limit(
    `auth_fail:${identifier}`,
    RATE_LIMITS.AUTH_FAILURE.maxRequests,
    RATE_LIMITS.AUTH_FAILURE.windowMs
  );

  return result.success; // Returns false if too many failures
}
