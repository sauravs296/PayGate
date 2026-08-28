import { NextRequest, NextResponse } from "next/server";
import { Keypair, WebAuth } from "@stellar/stellar-sdk";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const account = url.searchParams.get("account");
    if (!account) {
      return NextResponse.json({ error: "Missing account parameter" }, { status: 400 });
    }

    const treasurySecret = process.env.PAYGATE_TREASURY_SECRET_KEY;
    if (!treasurySecret) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const serverKeypair = Keypair.fromSecret(treasurySecret);
    const networkPassphrase = process.env.STELLAR_NETWORK === "pubnet" 
      ? "Public Global Stellar Network ; September 2015"
      : "Test SDF Network ; September 2015";

    // Build the SEP-10 challenge transaction
    const challengeTx = WebAuth.buildChallengeTx(
      serverKeypair,
      account,
      "PayGate Dashboard",
      300,
      networkPassphrase,
      "paygate-login"
    );

    return NextResponse.json({ transaction: challengeTx });
  } catch (error) {
    console.error("Auth challenge error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

