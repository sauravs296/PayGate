import { Keypair } from "@stellar/stellar-sdk";
import { createHash } from "crypto";

/**
 * Verifies a message signed by a Stellar wallet following SEP-53.
 *
 * Wallets like Freighter automatically prepend "Stellar Signed Message:\n"
 * to the message and SHA-256 hash the result before signing with Ed25519.
 *
 * @param publicKey  The Stellar public key (G...) of the signer
 * @param message    The original string message that was signed
 * @param signature  The base64-encoded Ed25519 signature returned by the wallet
 * @returns true if the signature is valid
 */
export function verifyStellarSignature(
  publicKey: string,
  message: string,
  signature: string
): boolean {
  try {
    const keypair = Keypair.fromPublicKey(publicKey);

    // SEP-53: wallets prepend this prefix before hashing
    const prefixed = `Stellar Signed Message:\n${message}`;
    const hash = createHash("sha256").update(prefixed).digest();

    const sigBuffer = Buffer.from(signature, "base64");

    console.log("SEP-53 Verification:");
    console.log("  publicKey :", publicKey);
    console.log("  hash (hex):", hash.toString("hex"));
    console.log("  sig length:", sigBuffer.length);

    const isValid = keypair.verify(hash, sigBuffer);
    console.log("  isValid   :", isValid);

    return isValid;
  } catch (err) {
    console.error("Signature verification failed:", err);
    return false;
  }
}


