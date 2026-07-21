import { getSession } from "@/lib/auth/session";
import { getApiById } from "@/lib/db/apis";
import { getDailyEarnings, getTotalEarnings, getTopCallers } from "@/lib/db/calls";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Settings, Copy, TerminalSquare, Activity, DollarSign } from "lucide-react";
import Link from "next/link";
import { EarningsChart } from "@/components/EarningsChart";
import { LiveFeed } from "@/components/LiveFeed";
import { TopCallers } from "@/components/TopCallers";

export default async function ApiDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  const api = await getApiById(params.id, session.developerId);

  if (!api) {
    notFound();
  }

  const [totalEarnings, dailyEarnings, topCallers] = await Promise.all([
    getTotalEarnings(api.id),
    getDailyEarnings(api.id, 30),
    getTopCallers(api.id, 10),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="text-zinc-400 hover:text-white hover:bg-zinc-800 hidden sm:flex">
            <Link href="/apis">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{api.name}</h1>
              <Badge variant={api.isActive ? "default" : "secondary"} className={api.isActive ? "bg-teal-500/10 text-teal-400" : "bg-zinc-800"}>
                {api.isActive ? "Active" : "Inactive"}
              </Badge>
              {api.isListed && (
                <Badge variant="outline" className="text-violet-400 border-violet-500/30">
                  Listed
                </Badge>
              )}
            </div>
            <p className="text-zinc-400 mt-1 flex items-center font-mono text-sm">
              <TerminalSquare className="w-4 h-4 mr-2" />
              /{api.slug}
            </p>
          </div>
        </div>
        <Button asChild variant="outline" className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800">
          <Link href={`/apis/${api.id}/edit`}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-zinc-900 border-zinc-800 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Proxy Endpoint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-md p-3">
              <code className="text-violet-400 text-sm font-mono truncate mr-4">
                POST https://paygate.xyz/api/x/{api.slug}
              </code>
              <Button variant="ghost" size="sm" className="h-8 text-zinc-400 hover:text-white shrink-0">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <p className="text-xs text-zinc-500 mt-3 flex items-center">
              Requires <span className="font-mono text-zinc-300 mx-1 px-1 bg-zinc-800 rounded">{api.priceUsdc.toString()} USDC</span> per call.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total API Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-400 flex items-center">
              <DollarSign className="w-6 h-6 mr-1" />
              {totalEarnings.toFixed(4)}
            </div>
            <p className="text-sm text-zinc-500 mt-2">
              Lifetime USDC settled
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Earnings Chart */}
        <Card className="bg-zinc-900 border-zinc-800 lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">30-Day Earnings</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            <EarningsChart data={dailyEarnings} />
          </CardContent>
        </Card>

        {/* Live Feed */}
        <Card className="bg-zinc-900 border-zinc-800 flex flex-col h-[400px]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Live Calls</CardTitle>
            <div className="flex items-center text-xs text-teal-400 bg-teal-400/10 px-2 py-1 rounded-full animate-pulse">
              <Activity className="w-3 h-3 mr-1" />
              Live
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0 relative">
            <LiveFeed apiId={api.id} />
          </CardContent>
        </Card>
      </div>

      {/* Top Callers Table */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg">Top Callers</CardTitle>
        </CardHeader>
        <CardContent>
          <TopCallers callers={topCallers} />
        </CardContent>
      </Card>
    </div>
  );
}
