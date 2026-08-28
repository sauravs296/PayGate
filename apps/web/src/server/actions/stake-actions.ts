"use server";

import { getSession } from "@/lib/auth/session";
import { getApiById, updateApi } from "@/lib/db/apis";
import { rpc, TransactionBuilder, Contract, Address, nativeToScVal } from "@stellar/stellar-sdk";
import { getRpcUrl, getNetworkPassphrase } from "@/lib/stellar/signer";
import { revalidatePath } from "next/cache";

const REPUTATION_CONTRACT_ID = process.env.PAYGATE_REPUTATION_CONTRACT_ID;

export async function buildStakeTransactionAction(apiId: string, amountUsdc: number) {
  const session = await getSession();
  if (!session.isLoggedIn) throw new Error("Unauthorized");
  if (!REPUTATION_CONTRACT_ID) throw new Error("Reputation contract not configured");

  const api = await getApiById(apiId, session.developerId);
  if (!api) throw new Error("API not found");

  const network = process.env.STELLAR_NETWORK === "pubnet" ? "stellar:pubnet" : "stellar:testnet";
  const rpcUrl = getRpcUrl(network);
  const server = new rpc.Server(rpcUrl);
  const networkPassphrase = getNetworkPassphrase(network);

  const developerAddress = session.developerId;
  const account = await server.getAccount(developerAddress);
  
  const amountBase = Math.floor(amountUsdc * 10_000_000);

  const developerVal = new Address(developerAddress).toScVal();
  const apiIdVal = nativeToScVal(api.slug, { type: "string" });
  const amountVal = nativeToScVal(amountBase, { type: "i128" });

  const tx = new TransactionBuilder(account, {
    fee: "100000",
    networkPassphrase,
  })
    .addOperation(
      new Contract(REPUTATION_CONTRACT_ID).call("stake_api", developerVal, apiIdVal, amountVal)
    )
    .setTimeout(300) // generous timeout for wallet signing
    .build();

  const preparedTx = await server.prepareTransaction(tx);
  return preparedTx.toXDR();
}

export async function submitStakeTransactionAction(apiId: string, signedXdr: string) {
  const session = await getSession();
  if (!session.isLoggedIn) throw new Error("Unauthorized");

  const api = await getApiById(apiId, session.developerId);
  if (!api) throw new Error("API not found");

  const network = process.env.STELLAR_NETWORK === "pubnet" ? "stellar:pubnet" : "stellar:testnet";
  const rpcUrl = getRpcUrl(network);
  const server = new rpc.Server(rpcUrl);

  const tx = rpc.TransactionBuilder.fromXDR(signedXdr, getNetworkPassphrase(network));
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendResponse = await server.sendTransaction(tx as any);
  if (sendResponse.status !== "PENDING") {
    throw new Error(`Transaction failed to send: ${sendResponse.status}`);
  }

  // Update DB to listed
  await updateApi(apiId, session.developerId, { isListed: true });
  
  revalidatePath("/dashboard");
  revalidatePath("/apis");
  revalidatePath(`/apis/${apiId}`);
  revalidatePath("/marketplace");
  
  return sendResponse.hash;
}
