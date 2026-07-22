import { getListedApis } from "@/lib/db/apis";
import { getBaseUrl } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, TerminalSquare, ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublicNav } from "@/components/PublicNav";

export const dynamic = "force-dynamic";

export default async function DirectoryPage() {
  const apis = await getListedApis();
  const baseUrl = getBaseUrl();

  return (
    <div className="min-h-screen bg-[#080810] text-zinc-50 font-sans">
      <PublicNav />
      
      <div className="max-w-6xl mx-auto px-4 pt-28 pb-20 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">PayGate Directory</h1>
          </div>
          <p className="text-zinc-400 text-lg">
            Discover pay-per-call APIs powered by x402 and Stellar.
          </p>
        </div>
        {/* We can optionally show some action buttons here too if we want */}
      </div>

      {/* Directory Grid */}
      {apis.length === 0 ? (
        <div className="text-center p-16 border border-zinc-800 border-dashed rounded-2xl bg-zinc-900/30">
          <Globe className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-zinc-300">No public APIs yet</h3>
          <p className="text-zinc-500 mt-2">
            Be the first to list your API in the PayGate directory.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apis.map((api) => (
            <Card key={api.slug} className="bg-zinc-900/50 border-zinc-800 hover:border-violet-500/50 hover:bg-zinc-900 transition-all group flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl group-hover:text-violet-400 transition-colors">
                    {api.name}
                  </CardTitle>
                  <Badge variant="outline" className="bg-teal-500/10 text-teal-400 border-teal-500/20 whitespace-nowrap ml-2">
                    {api.priceUsdc.toString()} USDC
                  </Badge>
                </div>
                <CardDescription className="text-zinc-400 line-clamp-2 mt-2">
                  {api.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1">
                <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg overflow-x-auto">
                  <p className="text-xs text-zinc-500 mb-1 font-mono uppercase tracking-wider">Endpoint</p>
                  <code className="text-sm font-mono text-violet-300 whitespace-nowrap">
                    {baseUrl}/api/x/{api.slug}
                  </code>
                </div>
              </CardContent>
              
              <CardFooter className="pt-0 flex flex-col gap-2">
                <Button asChild className="w-full justify-between bg-teal-600/10 hover:bg-teal-600/20 text-teal-400 border border-teal-500/20">
                  <Link href={`/playground/${api.slug}`}>
                    <span className="flex items-center">
                      <Play className="w-4 h-4 mr-2" />
                      Try in Playground
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="w-full justify-between text-zinc-400 hover:text-white hover:bg-zinc-800">
                  <Link href={`/docs/${api.slug}`}>
                    <span className="flex items-center">
                      <TerminalSquare className="w-4 h-4 mr-2" />
                      View Documentation
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

