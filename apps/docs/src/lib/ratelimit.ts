import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

// Sliding window: 20 requests per 10 seconds per caller wallet.
// Applied before payment verification to block abuse without touching the facilitator.
// Tune limits per-API once the basic loop is working.
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "10 s"),
  analytics: true, // enables request counting visible in the Upstash console
  prefix: "paygate:ratelimit",
});

