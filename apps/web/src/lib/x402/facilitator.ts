/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/x402/facilitator.ts
//
// LOCAL Stellar facilitator — runs verify + settle in-process using ExactStellarScheme.
// This replaces the hosted OpenZeppelin HTTPFacilitatorClient so we can use our own
// self-issued testnet USDC contract without needing Circle approval or an API key.
//
// On mainnet, swap PAYGATE_TREASURY_SECRET_KEY for a proper HSM / KMS signer.

import { ExactStellarScheme } from "@x402/stellar/exact/facilitator";
import { createEd25519Signer } from "@x402/stellar";

const TREASURY_SECRET = process.env.PAYGATE_TREASURY_SECRET_KEY;
const NETWORK =
  process.env.STELLAR_NETWORK === "pubnet" ? "stellar:pubnet" : "stellar:testnet";

function buildScheme(): ExactStellarScheme {
  if (!TREASURY_SECRET) {
    throw new Error("PAYGATE_TREASURY_SECRET_KEY is not set");
  }
  const signer = createEd25519Signer(TREASURY_SECRET, NETWORK as any);
  return new ExactStellarScheme([signer as any], {
    areFeesSponsored: true,
    // Raise the fee ceiling to 500k stroops (0.05 XLM).
    // The default 50k is too tight for testnet — Soroban simulations
    // on congested ledgers regularly produce a minResourceFee above that,
    // causing "invalid_exact_stellar_payload_fee_exceeds_maximum".
    maxTransactionFeeStroops: 500_000,
  });
}

/**
 * A FacilitatorClient that processes Stellar exact-scheme payments in-process.
 * No external HTTP calls — verify and settle are handled locally against the
 * Stellar testnet (or pubnet) RPC node.
 */
class LocalStellarFacilitator {
  private scheme: ExactStellarScheme;

  constructor() {
    this.scheme = buildScheme();
  }

  async verify(
    paymentPayload: any,
    paymentRequirements: any
  ): Promise<any> {
    return this.scheme.verify(paymentPayload as any, paymentRequirements as any);
  }

  async settle(
    paymentPayload: any,
    paymentRequirements: any
  ): Promise<any> {
    return this.scheme.settle(paymentPayload as any, paymentRequirements as any);
  }

  async getSupported(): Promise<any> {
    return {
      kinds: [
        {
          x402Version: 2,
          scheme: "exact",
          network: NETWORK as any,
          extra: { areFeesSponsored: true },
        },
      ],
      extensions: [],
      signers: {},
    };
  }
}

// Lazy singleton — only instantiated on the first real request, never at build time.
// This prevents `next build` from throwing when env vars are absent in CI.
let _facilitator: LocalStellarFacilitator | null = null;

export function getFacilitator(): LocalStellarFacilitator {
  if (!_facilitator) {
    _facilitator = new LocalStellarFacilitator();
  }
  return _facilitator;
}

