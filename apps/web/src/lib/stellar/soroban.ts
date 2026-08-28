// src/lib/stellar/soroban.ts
// Handles interactions with the Soroban receipt-verifier contract.

import { Keypair, rpc, TransactionBuilder, Contract, Address, nativeToScVal } from "@stellar/stellar-sdk";
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

const routerContractId = process.env.PAYGATE_ROUTER_CONTRACT_ID;

export async function setRouteOnChain(opts: {
  apiId: string;
  developerWallet: string;
  shareBps: number;
}): Promise<string | null> {
  if (!routerContractId || !adminSecret) {
    console.warn("Skipping on-chain route config: missing contract ID or admin secret");
    return null;
  }

  try {
    const network = process.env.STELLAR_NETWORK === "pubnet" ? "stellar:pubnet" : "stellar:testnet";
    const rpcUrl = getRpcUrl(network);
    const server = new rpc.Server(rpcUrl);
    const networkPassphrase = getNetworkPassphrase(network);
    
    const adminKeypair = Keypair.fromSecret(adminSecret);
    const adminAddress = adminKeypair.publicKey();
    
    const account = await server.getAccount(adminAddress);

    const apiIdVal = nativeToScVal(opts.apiId, { type: "string" });
    const developerVal = new Address(opts.developerWallet).toScVal();
    const shareBpsVal = nativeToScVal(opts.shareBps, { type: "u32" });

    const tx = new TransactionBuilder(account, {
      fee: "100000",
      networkPassphrase,
    })
      .addOperation(
        new Contract(routerContractId).call("set_route", apiIdVal, developerVal, shareBpsVal)
      )
      .setTimeout(30)
      .build();

    const preparedTx = await server.prepareTransaction(tx);
    preparedTx.sign(adminKeypair);
    
    const sendResponse = await server.sendTransaction(preparedTx);
    if (sendResponse.status !== "PENDING") {
      throw new Error(`Transaction failed to send: ${sendResponse.status}`);
    }

    return sendResponse.hash;
  } catch (err) {
    console.error("Failed to set route on-chain:", err);
    return null;
  }
}

const usdcContractId = process.env.SOROBAN_USDC_CONTRACT;

export async function processPaymentOnChain(opts: {
  apiId: string;
  amountUsdc: number;
}): Promise<string | null> {
  if (!routerContractId || !adminSecret || !usdcContractId) {
    console.warn("Skipping on-chain payment processing: missing config");
    return null;
  }

  try {
    const network = process.env.STELLAR_NETWORK === "pubnet" ? "stellar:pubnet" : "stellar:testnet";
    const rpcUrl = getRpcUrl(network);
    const server = new rpc.Server(rpcUrl);
    const networkPassphrase = getNetworkPassphrase(network);
    
    const adminKeypair = Keypair.fromSecret(adminSecret);
    const adminAddress = adminKeypair.publicKey();
    
    const account = await server.getAccount(adminAddress);
    
    const amountBase = Math.floor(opts.amountUsdc * 10_000_000);

    const callerVal = new Address(adminAddress).toScVal();
    const tokenVal = new Address(usdcContractId).toScVal();
    const apiIdVal = nativeToScVal(opts.apiId, { type: "string" });
    const amountVal = nativeToScVal(amountBase, { type: "i128" });

    const tx = new TransactionBuilder(account, {
      fee: "100000",
      networkPassphrase,
    })
      .addOperation(
        new Contract(routerContractId).call("pay", callerVal, tokenVal, apiIdVal, amountVal)
      )
      .setTimeout(30)
      .build();

    const preparedTx = await server.prepareTransaction(tx);
    preparedTx.sign(adminKeypair);
    
    const sendResponse = await server.sendTransaction(preparedTx);
    if (sendResponse.status !== "PENDING") {
      throw new Error(`Transaction failed to send: ${sendResponse.status}`);
    }

    return sendResponse.hash;
  } catch (err) {
    console.error("Failed to process payment on-chain:", err);
    return null;
  }
}

