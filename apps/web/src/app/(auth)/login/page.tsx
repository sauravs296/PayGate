"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getWalletKit } from "@/lib/stellar/wallet-kit";
import { useToast } from "@/components/ui/toast";
import { Loader2, Wallet, Zap, Shield, BarChart3 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { success, error: toastError, info } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      info("Opening wallet…", "Please select your Stellar wallet to continue.");

      const kit = getWalletKit();

      // 1. Open auth modal — lets user pick Freighter, Albedo, etc.
      const { address } = await kit.authModal();

      info("Signing message…", "Please approve the signature request in your wallet.");

      // 2. Get a challenge nonce from the server
      const challengeRes = await fetch("/api/auth/challenge");
      if (!challengeRes.ok) throw new Error("Failed to get challenge from server.");
      const { nonce, message } = await challengeRes.json();

      // 3. Ask the wallet to sign the challenge message (Freighter uses SEP-53 internally)
      const { signedMessage } = await kit.signMessage(message, { address });

      // 4. Verify the signature server-side and create session
      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicKey: address,
          signature: signedMessage,
          nonce,
        }),
      });

      if (!verifyRes.ok) {
        const data = await verifyRes.json().catch(() => ({}));
        throw new Error(data.error ?? "Verification failed. Please try again.");
      }

      success("Connected!", "Redirecting you to your dashboard…");
      setTimeout(() => router.push("/dashboard"), 800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to connect wallet.";
      // Ignore user-cancelled wallet flows silently
      if (
        msg.toLowerCase().includes("user declined") ||
        msg.toLowerCase().includes("user rejected") ||
        msg.toLowerCase().includes("cancelled")
      ) {
        toastError("Cancelled", "Wallet connection was cancelled.");
      } else {
        toastError("Connection failed", msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0f] text-[#f0f0ff]">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/40 via-[#0a0a0f] to-teal-950/20" />

      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-violet-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-black/20 overflow-hidden">
            <Image
              src="/logo.png"
              alt="PayGate Logo"
              width={64}
              height={64}
              className="object-contain w-full h-full"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            PayGate
          </h1>
          <p className="mt-2 text-zinc-500 text-sm text-center">
            Monetize any API in 3 lines of code
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/40">
          <h2 className="text-lg font-semibold text-zinc-100 mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
            Connect your Stellar wallet to access your developer dashboard.
            No password needed — ever.
          </p>

          <Button
            id="connect-wallet-btn"
            onClick={handleConnect}
            disabled={isLoading}
            size="lg"
            className="w-full h-12 text-sm font-semibold bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-teal-500 text-white border-0 rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting…
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Stellar Wallet
              </>
            )}
          </Button>

          {/* Supported wallets */}
          <p className="mt-4 text-center text-xs text-zinc-600">
            Supports Freighter · Albedo · xBull · Lobstr · and more
          </p>
        </div>

        {/* Feature pills */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { icon: Zap, label: "Pay-per-call", sub: "No subscriptions" },
            { icon: Shield, label: "Trustless", sub: "Wallet-signed auth" },
            { icon: BarChart3, label: "Analytics", sub: "Real-time insights" },
          ].map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center"
            >
              <Icon className="h-4 w-4 text-violet-400 mb-0.5" />
              <span className="text-xs font-medium text-zinc-300">{label}</span>
              <span className="text-[10px] text-zinc-600">{sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

