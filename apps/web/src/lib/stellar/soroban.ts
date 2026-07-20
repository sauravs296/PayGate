// src/lib/stellar/soroban.ts
// Handles interactions with the Soroban receipt-verifier contract.

import { Keypair, rpc, TransactionBuilder, Networks, Contract, Address, xdr, nativeToScVal } from "@stellar/stellar-sdk";
import { getRpcUrl, getNetworkPassphrase } from "./signer";

const contractId = process.env.SOROBAN_CONTRACT_ID;
const adminSecret = process.env.PAYGATE_TREASURY_SECRET_KEY;

export async function logReceiptOnChain(opts: {
  callerWallet: string;
  apiId: string;
  amountUsdc: number;
}): Promise<string | null> {
  if (!contractId || !adminSecret) {
    console.warn("Skipping on-chain receipt log: missing contract ID or admin secret");
    return null;
  }

  try {
    const network = process.env.STELLAR_NETWORK === "pubnet" ? "stellar:pubnet" : "stellar:testnet";
    const rpcUrl = getRpcUrl(network);
    const server = new rpc.Server(rpcUrl);
    const networkPassphrase = getNetworkPassphrase(network);
    
    const adminKeypair = Keypair.fromSecret(adminSecret);
    const adminAddress = adminKeypair.publicKey();
    
    // Load account sequence
    const account = await server.getAccount(adminAddress);
    
    // amount in 7-decimal base units
    const amountBase = Math.floor(opts.amountUsdc * 10_000_000);

    // Prepare arguments
    const adminVal = new Address(adminAddress).toScVal();
    const callerVal = new Address(opts.callerWallet).toScVal();
    const apiIdVal = nativeToScVal(opts.apiId, { type: "string" });
    const amountVal = nativeToScVal(amountBase, { type: "i128" });

    // Build the transaction
    const tx = new TransactionBuilder(account, {
      fee: "100000",
      networkPassphrase,
    })
      .addOperation(
        new Contract(contractId).call("record_receipt", adminVal, callerVal, apiIdVal, amountVal)
      )
      .setTimeout(30)
      .build();

    // Prepare and simulate
    const preparedTx = await server.prepareTransaction(tx);
    
    // Sign the transaction
    preparedTx.sign(adminKeypair);

    // Send the transaction
    const sendResponse = await server.sendTransaction(preparedTx);
    
    if (sendResponse.status !== "PENDING") {
      throw new Error(`Transaction failed to send: ${sendResponse.status}`);
    }

    return sendResponse.hash;
  } catch (err) {
    console.error("Failed to log receipt on-chain:", err);
    return null;
  }
}
