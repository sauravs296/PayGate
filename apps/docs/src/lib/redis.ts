import { Redis } from "@upstash/redis";

// Upstash Redis uses a REST API — no persistent TCP connection required.
// This is what makes it work correctly on Vercel's serverless/edge runtime.
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

