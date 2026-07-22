"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Terminal,
  Play,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Info,
  Zap,
  Wallet,
  Coins,
} from "lucide-react";
import Link from "next/link";
import { getWalletKit } from "@/lib/stellar/wallet-kit";
import { Networks } from "@stellar/stellar-sdk";

type LogEntry = {
  id: string;
  msg: string;
  type: "info" | "success" | "error" | "system";
};

export function PlaygroundClient({
  apiSlug,
  apiName,
}: {
  apiSlug: string;
  apiName: string;
  priceUsdc: number;
  baseUrl: string;
}) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isFunding, setIsFunding] = useState(false);
  const [responseData, setResponseData] = useState<Record<string, unknown> | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [hasDone, setHasDone] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string, type: LogEntry["type"] = "info") => {
    setLogs((prev) => [...prev, { id: Math.random().toString(), msg, type }]);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Fetch USDC balance from Horizon after connecting or funding
  const fetchBalance = async (address: string) => {
    try {
      const res = await fetch(
        `https://horizon-testnet.stellar.org/accounts/${address}`
      );
      if (!res.ok) return;
      const data = await res.json() as { balances?: { asset_code?: string; balance?: string }[] };
      const usdcEntry = data.balances?.find(
        (b) => b.asset_code === "USDC"
      );
      setUsdcBalance(usdcEntry ? parseFloat(usdcEntry.balance ?? "0").toFixed(2) : "0.00");
    } catch {
      setUsdcBalance(null);
    }
  };

  const handleConnect = async () => {
    try {
      const kit = getWalletKit();
      const { address } = await kit.authModal();
      setWalletAddress(address);
      await fetchBalance(address);
    } catch (err) {
      console.error("Wallet connection failed", err);
    }
  };

  const handleFundUsdc = async () => {
    if (!walletAddress) return;
    setIsFunding(true);
    try {
      // Step 1: Check trustline / get unsigned XDR
      const checkRes = await fetch(
        `/api/playground/fund?address=${walletAddress}`
      );
      const checkData = await checkRes.json();

      if (!checkRes.ok) throw new Error(checkData.error ?? "Fund check failed");

      let signedXdr: string | null = null;

      if (!checkData.trustlineExists) {
        // Step 2: Sign the trustline transaction with Freighter
        const kit = getWalletKit();
        const { signedTxXdr } = await kit.signTransaction(checkData.xdr, {
          networkPassphrase: Networks.TESTNET,
          address: walletAddress,
        });
        signedXdr = signedTxXdr;
      }

      // Step 3: Issue USDC (and submit trustline if needed)
      const issueRes = await fetch(`/api/playground/fund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: walletAddress, signedXdr }),
      });
      const issueData = await issueRes.json();

      if (!issueRes.ok) throw new Error(issueData.error ?? "Funding failed");

      await fetchBalance(walletAddress);
    } catch (err: unknown) {
      console.error("Funding error:", err instanceof Error ? err.message : err);
    } finally {
      setIsFunding(false);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setLogs([]);
    setResponseData(null);
    setTxHash(null);
    setHasDone(false);

    addLog(`Initiating live demo for "${apiName}"...`, "system");

    const eventSource = new EventSource(`/api/playground/${apiSlug}`);

    eventSource.addEventListener("log", (e) => {
      const { type, msg } = JSON.parse(e.data);
      addLog(msg, type);
    });

    eventSource.addEventListener("result", (e) => {
      const payload = JSON.parse(e.data) as { data: Record<string, unknown>; txHash: string };
      setResponseData(payload.data);
      setTxHash(payload.txHash);
    });

    eventSource.addEventListener("error", (e) => {
      try {
        const { message } = JSON.parse((e as MessageEvent).data);
        addLog(`Error: ${message}`, "error");
      } catch {
        // stream closed
      }
    });

    eventSource.addEventListener("done", () => {
      setHasDone(true);
      setIsRunning(false);
      eventSource.close();
      // Refresh balance after run completes
      if (walletAddress) fetchBalance(walletAddress);
    });

    eventSource.onerror = () => {
      setIsRunning(false);
      eventSource.close();
    };
  };

  const logIcon = (type: LogEntry["type"]) => {
    if (type === "success")
      return <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0 mt-0.5" />;
    if (type === "error")
      return <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />;
    if (type === "system")
      return <Zap className="h-3.5 w-3.5 text-violet-400 shrink-0 mt-0.5" />;
    return <Info className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />;
  };

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Button variant="ghost" asChild className="text-zinc-400 hover:text-white">
          <Link href="/marketplace">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
          </Link>
        </Button>

        <div className="flex flex-wrap items-center gap-3">
          {!walletAddress ? (
            <Button
              onClick={handleConnect}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          ) : (
            <>
              {/* Wallet info chip */}
              <div className="flex items-center gap-2 text-xs bg-zinc-900 border border-zinc-800 rounded-full px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-zinc-300 font-mono">
                  {walletAddress.slice(0, 8)}...{walletAddress.slice(-4)}
                </span>
                {usdcBalance !== null && (
                  <span className="ml-1 text-teal-400 font-semibold">
                    {usdcBalance} USDC
                  </span>
                )}
              </div>

              {/* Fund USDC button */}
              <Button
                onClick={handleFundUsdc}
                disabled={isFunding}
                variant="outline"
                className="border-teal-500/40 text-teal-300 hover:bg-teal-500/10 hover:border-teal-400"
              >
                {isFunding ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Coins className="mr-2 h-4 w-4" />
                )}
                {isFunding ? "Funding..." : "Get 10 USDC"}
              </Button>

              {/* Run button */}
              <Button
                onClick={handleRun}
                disabled={isRunning}
                className="bg-gradient-to-r from-violet-600 to-teal-600 hover:from-violet-500 hover:to-teal-500 text-white shadow-lg shadow-violet-500/20"
              >
                {isRunning ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                {isRunning ? "Running..." : "Run Paid Request"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Fund helper banner — shows when wallet connected but balance is 0 */}
      {walletAddress && usdcBalance === "0.00" && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 flex items-center gap-3 text-sm text-amber-300">
          <Coins className="h-4 w-4 shrink-0 text-amber-400" />
          <span>
            Your wallet has no testnet USDC.{" "}
            <button
              onClick={handleFundUsdc}
              disabled={isFunding}
              className="underline underline-offset-2 hover:text-amber-100 font-medium"
            >
              Click here to get 10 free testnet USDC
            </button>{" "}
            to participate as a buyer.
          </span>
        </div>
      )}

      {/* Main panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Live sequence log */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden flex flex-col h-[520px]">
          <div className="bg-zinc-900/80 border-b border-zinc-800 px-4 py-3 flex items-center gap-2">
            <Terminal className="h-4 w-4 text-violet-400" />
            <h3 className="text-sm font-semibold text-zinc-200">Live x402 Sequence</h3>
            {isRunning && (
              <span className="ml-auto text-xs text-violet-400 animate-pulse">
                ● recording
              </span>
            )}
            {hasDone && !isRunning && (
              <span className="ml-auto text-xs text-green-400">✓ complete</span>
            )}
          </div>
          <div className="flex-1 p-4 font-mono text-xs overflow-y-auto bg-[#080810] space-y-2">
            {logs.length === 0 && (
              <div className="text-zinc-600 italic mt-8 text-center text-sm">
                {!walletAddress
                  ? "Connect your wallet to begin"
                  : 'Click "Run Paid Request" to watch the live x402 flow'}
              </div>
            )}
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-2">
                {logIcon(log.type)}
                <span
                  className={
                    log.type === "success"
                      ? "text-green-400"
                      : log.type === "error"
                      ? "text-red-400"
                      : log.type === "system"
                      ? "text-violet-300"
                      : "text-blue-300"
                  }
                >
                  {log.msg}
                </span>
              </div>
            ))}
            {isRunning && (
              <div className="flex items-center gap-2 text-zinc-500 animate-pulse">
                <span>▋</span>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        {/* Right: Response JSON */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden flex flex-col h-[520px]">
          <div className="bg-zinc-900/80 border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-200">Response Payload</h3>
            {responseData && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">
                200 OK
              </span>
            )}
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-[#080810]">
            {responseData ? (
              <div className="space-y-3">
                {txHash && (
                  <div className="rounded-lg border border-teal-500/20 bg-teal-500/5 p-3 text-xs font-mono text-teal-300 break-all">
                    <span className="text-teal-500 block mb-1 font-sans font-semibold not-italic">
                      Transaction Hash
                    </span>
                    {txHash}
                  </div>
                )}
                <pre className="text-zinc-300 font-mono text-xs leading-relaxed">
                  {JSON.stringify(responseData, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-zinc-600 h-full flex flex-col items-center justify-center text-center px-8 gap-3">
                <Terminal className="h-8 w-8 text-zinc-800" />
                <span className="text-sm italic">Awaiting successful response...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
