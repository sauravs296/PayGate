"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { getWalletKit } from "@/lib/stellar/wallet-kit";
import { buildStakeTransactionAction, submitStakeTransactionAction } from "@/server/actions/stake-actions";
import { Loader2, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function StakeToPublish({ apiId, isListed }: { apiId: string; isListed: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const { success, error, info } = useToast();

  if (isListed) {
    return null; // Already listed/staked
  }

  const handleStake = async () => {
    try {
      setIsLoading(true);
      info("Building transaction…", "Please wait while we prepare the Soroban transaction.");

      // 1. Build XDR on server
      const buildResult = await buildStakeTransactionAction(apiId, 1.0); // 1 USDC stake
      if (!buildResult.success) {
        error("Staking failed", buildResult.error);
        setIsLoading(false);
        return;
      }

      info("Signing required", "Please approve the transaction in your wallet.");

      // 2. Sign with wallet
      const kit = getWalletKit();
      const networkPassphrase = process.env.NEXT_PUBLIC_STELLAR_NETWORK === "pubnet" ? "Public Global Stellar Network ; September 2015" : "Test SDF Network ; September 2015";
      const { signedTxXdr } = await kit.signTransaction(buildResult.xdr, { networkPassphrase });

      info("Submitting transaction…", "Sending to the Stellar network.");

      // 3. Submit
      const submitResult = await submitStakeTransactionAction(apiId, signedTxXdr);
      if (!submitResult.success) {
        error("Staking failed", submitResult.error);
        setIsLoading(false);
        return;
      }

      success("API Published!", "Your API is now staked and listed in the marketplace.");
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      error("Staking failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-violet-950/20 border-violet-500/30">
      <CardHeader>
        <CardTitle className="text-violet-400 flex items-center">
          <ShieldCheck className="w-5 h-5 mr-2" />
          Publish to Marketplace
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Stake 1 USDC to list your API in the public directory and build on-chain reputation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleStake} 
          disabled={isLoading}
          className="bg-violet-600 hover:bg-violet-700 text-white w-full sm:w-auto"
        >
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Staking…</>
          ) : (
            "Stake 1 USDC & Publish"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
