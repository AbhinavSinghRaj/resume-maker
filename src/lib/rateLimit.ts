import { NextRequest, NextResponse } from "next/server";

// Simple in-memory fixed-window limiter. It's per server instance, so on serverless it's a
// speed bump rather than a hard cap — swap in Upstash/Redis if you need a global limit.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 30;
const hits = new Map<string, { count: number; resetAt: number }>();

/** Returns a 429 response if this client has made too many AI requests, otherwise null. */
export function rateLimit(req: NextRequest): NextResponse | null {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    if (hits.size > 10_000) {
      for (const [k, v] of hits) if (v.resetAt < now) hits.delete(k);
    }
    return null;
  }

  entry.count++;
  if (entry.count > MAX_REQUESTS) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      { error: `Too many requests. Please wait ${Math.ceil(retryAfter / 60)} min and try again.` },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }
  return null;
}
