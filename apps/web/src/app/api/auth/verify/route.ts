import { NextResponse } from "next/server";
import { Keypair, WebAuth } from "@stellar/stellar-sdk";
import { getSession } from "@/lib/auth/session";
import { upsertDeveloper } from "@/lib/db/developers";

export async function POST(request: Request) {
  try {
    const { transaction } = await request.json();

    if (!transaction) {
      return NextResponse.json({ error: "Missing transaction" }, { status: 400 });
    }

    const treasurySecret = process.env.PAYGATE_TREASURY_SECRET_KEY;
    if (!treasurySecret) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const serverKeypair = Keypair.fromSecret(treasurySecret);
    const networkPassphrase = process.env.STELLAR_NETWORK === "pubnet" 
      ? "Public Global Stellar Network ; September 2015"
      : "Test SDF Network ; September 2015";

    // 1. Read and parse the challenge transaction
    const parsedTx = WebAuth.readChallengeTx(
      transaction,
      serverKeypair.publicKey(),
      networkPassphrase,
      "PayGate Dashboard",
      "paygate-login"
    );

    const clientAccountId = parsedTx.tx.source;

    // 2. Fetch signers from the network using Soroban RPC (or Horizon)
    // For simplicity, we just verify the clientAccountId directly since it's an ed25519 key.
    // In a full SEP-10 implementation, we would query the network for thresholds.
    const isValidSignature = WebAuth.verifyChallengeTxSigners(
      transaction,
      serverKeypair.publicKey(),
      networkPassphrase,
      "PayGate Dashboard",
      "paygate-login"
    );

    if (isValidSignature.length === 0) {
       return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 3. Upsert developer in the database
    const developer = await upsertDeveloper(clientAccountId);

    // 4. Create Iron Session
    const session = await getSession();
    session.developerId = developer.id;
    session.stellarWallet = developer.stellarWallet;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({ success: true, redirect: "/dashboard" });
  } catch (error) {
    console.error("Auth verify error:", error);
    return NextResponse.json({ error: "Invalid SEP-10 transaction" }, { status: 401 });
  }
}

