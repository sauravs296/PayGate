"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyEndpointChip({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <button
      onClick={handleCopy}
      title="Click to copy endpoint"
      className="group hidden lg:inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 bg-zinc-800 border border-zinc-700 hover:border-violet-500/50 hover:text-zinc-300 hover:bg-zinc-700/50 rounded px-2 py-1 mr-2 max-w-[200px] truncate transition-all cursor-pointer"
    >
      {copied ? (
        <Check className="h-3 w-3 text-teal-400 shrink-0" />
      ) : (
        <Copy className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
      <span className="truncate">{url}</span>
    </button>
  );
}
