"use client";

import { useEffect, useState } from "react";
import type { FeedEntry } from "@/lib/feed";

export function LiveFeed({ apiId }: { apiId: string }) {
  const [entries, setEntries] = useState<FeedEntry[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    async function fetchFeed() {
      try {
        const res = await fetch(`/api/internal/feed/${apiId}`);
        if (!res.ok) throw new Error("Failed to fetch feed");
        const data = await res.json();
        setEntries(data.feed || []);
        setError(false);
      } catch (err) {
        console.error(err);
        setError(true);
      }
    }

    fetchFeed();
    interval = setInterval(fetchFeed, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [apiId]);

  const formatWallet = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
  };

  if (error && entries.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center text-zinc-500 text-sm">
        Failed to load feed.
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center text-zinc-500 text-sm">
        No recent calls.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {entries.map((entry, idx) => (
        <div 
          key={entry.txHash + idx} 
          className="flex items-center justify-between p-3 border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex flex-col">
            <span className="font-mono text-sm text-zinc-300">
              {formatWallet(entry.callerWallet)}
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              {formatTime(entry.ts)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-teal-400 font-medium text-sm">
              +{entry.amountUsdc}
            </span>
            <a 
              href={`https://stellar.expert/explorer/testnet/tx/${entry.txHash}`} 
              target="_blank" 
              rel="noreferrer"
              className="text-xs text-violet-400 hover:text-violet-300 bg-violet-400/10 px-2 py-1 rounded"
            >
              Tx
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
