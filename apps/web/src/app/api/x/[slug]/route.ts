// src/app/api/x/[slug]/route.ts
// THE paywall route — the core of PayGate.
//
// Every registered API gets served through here:
//   /api/x/cricket-predictor  →  looks up "cricket-predictor" in DB
//                             →  verifies x402 payment
//                             →  logs to Postgres + Redis
//                             →  proxies to developer's real backend
//
// Flow:
//   No payment header  → 402 with PAYMENT-REQUIRED header (x402 protocol)
//   Payment present    → verify → settle → log → proxy
//   Rate limited       → 429 (checked before touching the facilitator)

import { NextRequest, NextResponse } from "next/server";
import {
  buildPaymentRequirements,
  build402Response,
  verifyPayment,
} from "@/lib/x402/middleware";
import { getActiveApiBySlug } from "@/lib/db/apis";
import { logApiCall } from "@/lib/db/calls";
import { pushToFeed, incrementEarningsCache, incrementCallCount } from "@/lib/feed";
import { ratelimit } from "@/lib/ratelimit";
import { logReceiptOnChain } from "@/lib/stellar/soroban";

type Params = { params: Promise<{ slug: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const start = Date.now();
  const { slug } = await params;

  // ── 1. Look up the API ──────────────────────────────────────────────────────
  const api = await getActiveApiBySlug(slug);
  if (!api) {
    return NextResponse.json({ error: "API not found" }, { status: 404 });
  }

  const paymentSigHeader = req.headers.get("PAYMENT-SIGNATURE") ?? req.headers.get("X-PAYMENT");

  // ── 2. No payment header → return 402 ──────────────────────────────────────
  if (!paymentSigHeader) {
    const requirements = buildPaymentRequirements({
      priceUsdc: api.priceUsdc.toString(),
      payTo: process.env.PAYGATE_TREASURY_WALLET!,
    });
    return build402Response(requirements, {
      resourceUrl: `${req.nextUrl.origin}/api/x/${slug}`,
      description: api.description ?? `Pay-per-call access to ${api.name}`,
    });
  }

  // ── 3. Rate limit (before touching the facilitator) ────────────────────────
  const callerWallet = req.headers.get("X-Caller-Wallet") ?? req.headers.get("x-forwarded-for") ?? "anonymous";
  const { success: rateLimitOk } = await ratelimit.limit(callerWallet);
  if (!rateLimitOk) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Slow down your requests." },
      { status: 429 }
    );
  }

  // ── 4. Verify + settle payment ─────────────────────────────────────────────
  const requirements = buildPaymentRequirements({
    priceUsdc: api.priceUsdc.toString(),
    payTo: process.env.PAYGATE_TREASURY_WALLET!,
  });

  const paymentResult = await verifyPayment(paymentSigHeader, requirements);

  if (!paymentResult.ok) {
    return NextResponse.json(
      { error: "Payment failed", detail: paymentResult.reason },
      { status: 402 }
    );
  }

  // Use the cryptographically verified address from the payment payload as
  // the authoritative callerWallet — overrides any header-based guess.
  const verifiedCaller =
    paymentResult.callerWallet !== "unknown"
      ? paymentResult.callerWallet
      : callerWallet;

  // Debug: log the raw payload shape once so we can see where the address lives.
  if (process.env.NODE_ENV !== "production") {
    console.log("[PayGate] paymentPayload shape:", JSON.stringify(paymentResult.paymentPayload, null, 2));
    console.log("[PayGate] resolved callerWallet:", verifiedCaller);
  }

  // ── 5. Proxy to the developer's real backend ───────────────────────────────
  let upstreamData: unknown;
  let latencyMs: number;
  try {
    const upstreamStart = Date.now();
    const upstream = await fetch(api.targetUrl, {
      headers: {
        "X-PayGate-Verified": "true",
        "X-PayGate-TxHash": paymentResult.txHash,
      },
    });
    latencyMs = Date.now() - upstreamStart;

    if (!upstream.ok) {
      throw new Error(`Upstream returned ${upstream.status}`);
    }
    upstreamData = await upstream.json();
  } catch (err) {
    // Log as failed even though payment settled — refunds are out of scope for MVP
    await logApiCall({
      apiId: api.id,
      callerWallet: verifiedCaller,
      amountUsdc: api.priceUsdc,
      txHash: paymentResult.txHash,
      network: (process.env.STELLAR_NETWORK === "pubnet" ? "pubnet" : "testnet"),
      status: "failed",
      latencyMs: Date.now() - start,
    });
    return NextResponse.json(
      { error: "Upstream API error", detail: String(err) },
      { status: 502 }
    );
  }

  // ── 6. Log to Postgres (source of truth) + Redis (fast feed + cache) ────────
  const network = process.env.STELLAR_NETWORK === "pubnet" ? "pubnet" : "testnet";
  latencyMs ??= Date.now() - start;

  await Promise.all([
    logApiCall({
      apiId: api.id,
      callerWallet: verifiedCaller,
      amountUsdc: api.priceUsdc,
      txHash: paymentResult.txHash,
      network,
      status: "settled",
      latencyMs,
    }),
    pushToFeed(api.id, {
      callerWallet: verifiedCaller,
      amountUsdc: Number(api.priceUsdc),
      txHash: paymentResult.txHash,
      ts: Date.now(),
    }),
    incrementEarningsCache(api.id, Number(api.priceUsdc)),
    incrementCallCount(api.id),
  ]);

  // Non-blocking: write receipt to Soroban contract as a side log
  logReceiptOnChain({
    callerWallet: verifiedCaller,
    apiId: api.id,
    amountUsdc: Number(api.priceUsdc),
  }).catch((err) => console.error("On-chain log failed:", err));

  // ── 7. Return the proxied data ─────────────────────────────────────────────
  return NextResponse.json(upstreamData, {
    status: 200,
    headers: {
      "X-PayGate-TxHash": paymentResult.txHash,
      "X-PayGate-Network": network,
    },
  });
}

// Support POST as well — some APIs accept POST bodies
export async function POST(req: NextRequest, context: Params) {
  return GET(req, context);
}
