import { getSession } from "@/lib/auth/session";
import { getApisByDeveloper } from "@/lib/db/apis";
import { getDeveloperTotalEarnings } from "@/lib/db/calls";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Activity, TerminalSquare } from "lucide-react";
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-zinc-400 mt-2">
          Your APIs, earnings, and metrics at a glance.
        </p>
      </div>

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
            <div className="text-2xl font-bold text-teal-400">
              {totalEarnings.toFixed(4)} USDC
            </div>
            <p className="text-xs text-zinc-500 mt-1">Lifetime settled</p>
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

