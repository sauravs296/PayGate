// x402 pricing helpers
// Used to build the 402 Payment Required response body.

export interface PriceConfig {
  amountUsdc: string; // e.g. "0.002"
  network: "stellar:testnet" | "stellar:pubnet";
  facilitatorUrl: string;
  payTo: string; // G... treasury wallet address
}

/**
 * Build the standard x402 402-response body.
 * The client (AI agent / x402 HTTP client) reads this to know what to pay and how.
 */
export function buildPaymentRequired(config: PriceConfig) {
  return {
    price: `$${config.amountUsdc}`,
    network: config.network,
    facilitator: config.facilitatorUrl,
    payTo: config.payTo,
  };
}

/**
 * Resolve the active network string from env.
 */
export function getActiveNetwork(): "stellar:testnet" | "stellar:pubnet" {
  return process.env.STELLAR_NETWORK === "pubnet"
    ? "stellar:pubnet"
    : "stellar:testnet";
}

