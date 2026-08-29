import { getSession } from "@/lib/auth/session";
import { getApisByDeveloper } from "@/lib/db/apis";
import { getDeveloperTotalEarnings } from "@/lib/db/calls";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Activity, TerminalSquare, BookOpen, ArrowRight, Zap, Code2, Wallet } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getDeveloperTotalCalls(developerId: string) {
  const result = await prisma.apiCall.count({
    where: { api: { developerId }, status: "settled" }
  });
  return result;
}

export default async function DashboardPage() {
  const session = await getSession();
  
  // Fetch data in parallel
  const [apis, totalEarnings, totalCalls] = await Promise.all([
    getApisByDeveloper(session.developerId),
    getDeveloperTotalEarnings(session.developerId),
    getDeveloperTotalCalls(session.developerId)
  ]);

  const isNewUser = apis.length === 0 && totalCalls === 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-zinc-400 mt-2">
          Your APIs, earnings, and metrics at a glance.
        </p>
      </div>

      {/* ── Welcome Walkthrough Card (new users only) ─────────────────────── */}
      {isNewUser && (
        <div className="rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-900/20 via-zinc-900/30 to-teal-900/10 p-6 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-600/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-100">
                  Welcome to PayGate! 👋
                </h2>
                <p className="text-zinc-400 text-sm mt-0.5">
                  You&apos;re all set. Here&apos;s how to get your first API earning USDC in 3 steps.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mb-5">
              {[
                {
                  icon: <Wallet className="w-4 h-4 text-teal-400" />,
                  step: "01",
                  title: "Wallet Connected",
                  desc: "Your Stellar wallet is verified and ready to receive USDC payments.",
                  done: true,
                },
                {
                  icon: <Code2 className="w-4 h-4 text-violet-400" />,
                  step: "02",
                  title: "Register an API",
                  desc: "Point PayGate at any HTTP endpoint and set your price per call.",
                  done: false,
                },
                {
                  icon: <Zap className="w-4 h-4 text-amber-400" />,
                  step: "03",
                  title: "Start Earning",
                  desc: "Share your paywalled URL. Every call settles USDC to your wallet.",
                  done: false,
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className={`rounded-xl border p-4 ${
                    item.done
                      ? "border-teal-500/30 bg-teal-500/5"
                      : "border-zinc-700/60 bg-zinc-900/40"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-mono ${item.done ? "text-teal-500" : "text-zinc-600"}`}>
                      {item.step}
                    </span>
                    {item.icon}
                    {item.done && (
                      <span className="ml-auto text-xs text-teal-400 font-medium">✓ Done</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-zinc-100 mb-1">{item.title}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Button
                asChild
                className="bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-900/30"
              >
                <Link href="/apis/new">
                  Register Your First API <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <Link href="/guide">
                  Read the Developer Guide
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-teal-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold text-teal-400">
                  {totalEarnings.toFixed(4)} USDC
                </div>
                <p className="text-xs text-zinc-500 mt-1">Lifetime settled</p>
              </div>
              <a
                href={`https://stellar.expert/explorer/${process.env.NEXT_PUBLIC_STELLAR_NETWORK === "pubnet" ? "public" : "testnet"}/account/${session.stellarWallet}`}
                target="_blank"
                rel="noopener noreferrer"
                title="View auto-settled transactions on Stellar Expert"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium h-7 px-3 border border-teal-500/30 bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition-colors"
              >
                <Zap className="w-3 h-3 mr-1.5" /> Auto-Settled
              </a>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total API Calls
            </CardTitle>
            <Activity className="h-4 w-4 text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalls}</div>
            <p className="text-xs text-zinc-500 mt-1">Paid requests</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Active APIs
            </CardTitle>
            <TerminalSquare className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apis.filter(a => a.isActive).length}
            </div>
            <p className="text-xs text-zinc-500 mt-1">Ready to accept payments</p>
          </CardContent>
        </Card>
      </div>

      {/* API List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Your APIs</h2>
          <Button asChild size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
            <Link href="/apis/new">Add API</Link>
          </Button>
        </div>
        
        {apis.length === 0 ? (
          <div className="text-center p-12 border border-zinc-800 border-dashed rounded-xl bg-zinc-900/50">
            <TerminalSquare className="h-10 w-10 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-300">No APIs yet</h3>
            <p className="text-zinc-500 mt-2 mb-6">
              Register your first API to start monetizing.
            </p>
            <Button asChild variant="outline" className="border-zinc-700 hover:bg-zinc-800">
              <Link href="/apis/new">Register API</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {apis.map((api) => (
              <Link key={api.id} href={`/apis/${api.id}`}>
                <Card className="bg-zinc-900 border-zinc-800 hover:border-violet-500/50 transition-all hover:-translate-y-1 group">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="font-semibold text-lg group-hover:text-violet-400 transition-colors">
                        {api.name}
                      </div>
                      <Badge variant={api.isActive ? "default" : "secondary"} className={api.isActive ? "bg-teal-500/10 text-teal-400 hover:bg-teal-500/20" : "bg-zinc-800"}>
                        {api.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="text-sm font-mono text-zinc-500 truncate mb-4">
                      /{api.slug}
                    </div>
                    <div className="flex justify-between items-center text-sm border-t border-zinc-800 pt-4">
                      <span className="text-zinc-400">
                        {api.priceUsdc.toString()} USDC
                      </span>
                      <span className="text-zinc-400 flex items-center">
                        <Activity className="h-3 w-3 mr-1" />
                        {api._count.calls} calls
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
