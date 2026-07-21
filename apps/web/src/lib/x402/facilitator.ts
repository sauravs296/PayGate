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
  return new ExactStellarScheme([signer as any], { areFeesSponsored: true });
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

// Singleton — Next.js route handlers re-use this across invocations within one worker.
export const facilitator = new LocalStellarFacilitator();

