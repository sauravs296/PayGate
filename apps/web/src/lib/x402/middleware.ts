// src/lib/x402/middleware.ts
// Core x402 payment verification logic for Next.js route handlers.
//
// This is the "3 lines to monetize an API" layer — it handles:
//   1. Detecting missing payment → building the 402 response
//   2. Decoding the payment signature header
//   3. Verifying + settling with the hosted facilitator
//
// The /api/x/[slug] route calls verifyPayment() and acts on the result.
// Everything else (logging, proxying) stays in the route handler.

import {
  decodePaymentSignatureHeader,
  encodePaymentRequiredHeader,
} from "@x402/core/http";
import { USDC_TESTNET_ADDRESS, USDC_PUBNET_ADDRESS } from "@x402/stellar";
import { facilitator, FACILITATOR_URL } from "./facilitator";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PaymentRequirements = {
  scheme: string;
  network: any;
  asset: string;
  amount: string;
  payTo: string;
  maxTimeoutSeconds: number;
  extra: Record<string, unknown>;
};

export type VerifyResult =
  | { ok: true; txHash: string; callerWallet: string; paymentPayload: unknown }
  | { ok: false; reason: string };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const NETWORK =
  process.env.STELLAR_NETWORK === "pubnet" ? "stellar:pubnet" : "stellar:testnet";

const USDC_ASSET =
  process.env.STELLAR_NETWORK === "pubnet"
    ? USDC_PUBNET_ADDRESS
    : USDC_TESTNET_ADDRESS;

/**
 * Build the paymentRequirements object that describes what the caller must pay.
 * This is encoded into the PAYMENT-REQUIRED response header on a 402.
 */
export function buildPaymentRequirements(opts: {
  priceUsdc: string;
  payTo: string; // treasury G... address
}): PaymentRequirements {
  // Convert decimal USDC to atomic units (7 decimals)
  const amountAtomic = Math.floor(parseFloat(opts.priceUsdc) * 10_000_000).toString();

  return {
    scheme: "exact",
    network: NETWORK,
    amount: amountAtomic,
    payTo: opts.payTo,
    maxTimeoutSeconds: 60,
    asset: USDC_ASSET,
    extra: { name: "USDC", version: "1", areFeesSponsored: true },
  };
}

/**
 * Build a 402 Payment Required response with the encoded PAYMENT-REQUIRED header.
 * The x402 client reads this header to know what to pay.
 */
export function build402Response(
  requirements: PaymentRequirements,
  opts: { resourceUrl: string; description: string }
): Response {
  const paymentRequired = {
    x402Version: 2,
    resource: { url: opts.resourceUrl, description: opts.description },
    accepts: [requirements],
  };
  const encoded = encodePaymentRequiredHeader(paymentRequired as any);
  return new Response(
    JSON.stringify({
      error: "Payment Required",
      x402Version: 2,
    }),
    {
      status: 402,
      headers: {
        "Content-Type": "application/json",
        "PAYMENT-REQUIRED": encoded,
      },
    }
  );
}

/**
 * Verify and settle a payment against the hosted facilitator.
 *
 * Returns ok:true with the txHash on success, ok:false with a reason on failure.
 * The route handler calls this after confirming the PAYMENT-SIGNATURE header exists.
 */
export async function verifyPayment(
  paymentSignatureHeader: string,
  requirements: PaymentRequirements
): Promise<VerifyResult> {
  // Decode the PAYMENT-SIGNATURE header into a structured payload
  let paymentPayload: unknown;
  try {
    paymentPayload = decodePaymentSignatureHeader(paymentSignatureHeader);
  } catch {
    return { ok: false, reason: "Invalid PAYMENT-SIGNATURE header format" };
  }

  // Step 1: verify — confirm the payment is valid before settling
  const verifyResult = await facilitator.verify(
    paymentPayload as any,
    requirements as any
  );
  if (!verifyResult.isValid) {
    return {
      ok: false,
      reason: verifyResult.invalidReason ?? "Payment verification failed",
    };
  }

  // Step 2: settle — broadcast the transaction on Stellar
  const settleResult = await facilitator.settle(
    paymentPayload as any,
    requirements as any
  );
  if (!settleResult.success) {
    return {
      ok: false,
      reason: settleResult.errorReason ?? "Payment settlement failed",
    };
  }

  return {
    ok: true,
    txHash: (settleResult as any).transaction ?? "",
    callerWallet: (paymentPayload as any)?.payload?.authorization?.from ?? "unknown",
    paymentPayload,
  };
}
