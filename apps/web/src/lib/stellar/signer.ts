// Stellar signer and network utilities — server-only module.
// Never import this in client components.
//
// Re-exports the utilities from @x402/stellar that are needed by the
// paywall route and the demo agent script, so call-sites import from
// @/lib/stellar/signer instead of reaching into the package directly.

export {
  createEd25519Signer,
  getNetworkPassphrase,
  getHorizonClient,
  getRpcClient,
  getRpcUrl,
  USDC_TESTNET_ADDRESS,
  USDC_PUBNET_ADDRESS,
  STELLAR_TESTNET_CAIP2,
  STELLAR_PUBNET_CAIP2,
} from "@x402/stellar";

/**
 * The active CAIP-2 network identifier, driven by STELLAR_NETWORK env var.
 * e.g. "stellar:testnet" or "stellar:pubnet"
 */
export function getActiveStellarNetwork(): string {
  return process.env.STELLAR_NETWORK === "pubnet"
    ? "stellar:pubnet"
    : "stellar:testnet";
}

/**
 * Fund a testnet account using Stellar Friendbot (free, testnet only).
 */
export async function fundTestnetAccount(publicKey: string): Promise<void> {
  if (process.env.STELLAR_NETWORK === "pubnet") {
    throw new Error("Friendbot is only available on testnet.");
  }
  const res = await fetch(
    `https://friendbot.stellar.org/?addr=${encodeURIComponent(publicKey)}`
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Friendbot failed for ${publicKey}: ${text}`);
  }
}

