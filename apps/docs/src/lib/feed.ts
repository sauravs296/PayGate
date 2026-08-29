// src/lib/feed.ts
// Redis live-feed and earnings-cache helpers.
//
// Design contract:
//   - Redis is NEVER the source of truth. It's a fast read layer over Postgres.
//   - Feed entries are capped at 50 per API (LPUSH + LTRIM).
//   - Earnings cache has a 60-second TTL — dashboard reads hit Redis, not Postgres,
//     for the "today's earnings" card. If the key is missing, the dashboard falls
//     back to a Prisma aggregate and re-primes the cache.
//   - All keys are namespaced with "paygate:" to avoid collisions.

import { redis } from "@/lib/redis";

// ─── Key helpers ──────────────────────────────────────────────────────────────

const feedKey = (apiId: string) => `paygate:feed:${apiId}`;
const earningsKey = (apiId: string) => `paygate:earnings:${apiId}:today`;
const totalCallsKey = (apiId: string) => `paygate:calls:${apiId}:total`;

// ─── Types ────────────────────────────────────────────────────────────────────

export type FeedEntry = {
  callerWallet: string;
  amountUsdc: number;
  txHash: string;
  ts: number; // Unix ms
};

// ─── Live Feed ────────────────────────────────────────────────────────────────

/**
 * Push a new settled call onto the live feed list for an API.
 * Trims the list to the last 50 entries so memory usage stays bounded.
 *
 * Called immediately after logApiCall() in the paywall route.
 */
export async function pushToFeed(
  apiId: string,
  entry: FeedEntry
): Promise<void> {
  const key = feedKey(apiId);
  await redis.lpush(key, JSON.stringify(entry));
  await redis.ltrim(key, 0, 49); // keep only the 50 most recent
}

/**
 * Read the live feed for an API (up to 50 entries, newest first).
 * Called by the /api/internal/feed/[apiId] route every 3-5 seconds from the dashboard.
 */
export async function getFeed(apiId: string): Promise<FeedEntry[]> {
  const raw = await redis.lrange(feedKey(apiId), 0, 49);
  return raw.map((item) =>
    typeof item === "string" ? JSON.parse(item) : item
  ) as FeedEntry[];
}

// ─── Earnings Cache ───────────────────────────────────────────────────────────

const EARNINGS_TTL_SECONDS = 60;

/**
 * Increment the cached today-earnings counter for an API.
 * Called after every settled payment — keeps the counter warm without
 * hitting Postgres on every dashboard refresh.
 */
export async function incrementEarningsCache(
  apiId: string,
  amountUsdc: number
): Promise<void> {
  const key = earningsKey(apiId);
  // INCRBYFLOAT works fine for USDC decimal amounts
  await redis.incrbyfloat(key, amountUsdc);
  // Reset TTL on every update so the key stays alive during active periods
  await redis.expire(key, EARNINGS_TTL_SECONDS);
}

/**
 * Read the cached today-earnings for an API.
 * Returns null if the cache has expired or was never set — caller should
 * fall back to a Prisma aggregate and call setEarningsCache() to re-prime.
 */
export async function getCachedEarnings(
  apiId: string
): Promise<number | null> {
  const val = await redis.get<string>(earningsKey(apiId));
  if (val === null) return null;
  return parseFloat(String(val));
}

/**
 * Explicitly set (or re-prime) the earnings cache.
 * Called by the dashboard when it falls back to a Prisma aggregate.
 */
export async function setEarningsCache(
  apiId: string,
  totalUsdc: number
): Promise<void> {
  await redis.set(earningsKey(apiId), totalUsdc, { ex: EARNINGS_TTL_SECONDS });
}

// ─── Call Count Cache ─────────────────────────────────────────────────────────

/**
 * Increment the total call count for an API.
 * Used for the "total calls" counter on the dashboard overview card.
 */
export async function incrementCallCount(apiId: string): Promise<void> {
  await redis.incr(totalCallsKey(apiId));
}

/**
 * Get the cached total call count for an API.
 * Returns null on a cache miss — dashboard falls back to Prisma count.
 */
export async function getCachedCallCount(
  apiId: string
): Promise<number | null> {
  const val = await redis.get<number>(totalCallsKey(apiId));
  return val;
}

/**
 * Set the total call count (used when re-priming from Postgres).
 */
export async function setCallCount(
  apiId: string,
  count: number
): Promise<void> {
  await redis.set(totalCallsKey(apiId), count);
}

