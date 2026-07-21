"use client";

import { useMemo } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import type { DailyEarnings } from "@/lib/db/calls";

export function EarningsChart({ data }: { data: DailyEarnings[] }) {
  // Format dates for display (e.g. "Jul 21")
  const chartData = useMemo(() => {
    return data.map(d => ({
      ...d,
      displayDate: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }));
  }, [data]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center text-zinc-500">
        No earnings data available yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 10,
          right: 10,
          left: -20,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
        <XAxis 
          dataKey="displayDate" 
          stroke="#71717a" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis 
          stroke="#71717a" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px" }}
          itemStyle={{ color: "#2dd4bf" }}
          formatter={(value: number) => [`${value.toFixed(4)} USDC`, "Earnings"]}
          labelStyle={{ color: "#a1a1aa", marginBottom: "4px" }}
        />
        <Line
          type="monotone"
          dataKey="totalUsdc"
          stroke="#2dd4bf"
          strokeWidth={2}
          dot={{ r: 4, fill: "#18181b", stroke: "#2dd4bf", strokeWidth: 2 }}
          activeDot={{ r: 6, fill: "#2dd4bf", stroke: "#18181b", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
