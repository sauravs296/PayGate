"use client";

import type { TopCaller } from "@/lib/db/calls";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Medal } from "lucide-react";

export function TopCallers({ callers }: { callers: TopCaller[] }) {
  const formatWallet = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  if (!callers || callers.length === 0) {
    return (
      <div className="flex h-32 w-full items-center justify-center text-zinc-500">
        No callers yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="w-12 text-zinc-400">Rank</TableHead>
            <TableHead className="text-zinc-400">Wallet</TableHead>
            <TableHead className="text-right text-zinc-400">Calls</TableHead>
            <TableHead className="text-right text-zinc-400">Total Spent (USDC)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {callers.map((caller, index) => (
            <TableRow key={caller.callerWallet} className="border-zinc-800 hover:bg-zinc-800/50">
              <TableCell className="font-medium text-zinc-400">
                {index === 0 && <Medal className="w-4 h-4 text-yellow-500" />}
                {index === 1 && <Medal className="w-4 h-4 text-zinc-400" />}
                {index === 2 && <Medal className="w-4 h-4 text-amber-700" />}
                {index > 2 && <span className="ml-1">{index + 1}</span>}
              </TableCell>
              <TableCell className="font-mono text-sm text-zinc-300">
                {formatWallet(caller.callerWallet)}
              </TableCell>
              <TableCell className="text-right text-zinc-300">
                {caller.callCount.toLocaleString()}
              </TableCell>
              <TableCell className="text-right text-teal-400 font-medium">
                {caller.totalUsdc.toFixed(4)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
