import { getActiveApiBySlug } from "@/lib/db/apis";
import { getBaseUrl } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TerminalSquare, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ApiDocsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const api = await getActiveApiBySlug(slug);
  const baseUrl = getBaseUrl();

  if (!api) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
      <Button variant="ghost" asChild className="text-zinc-400 hover:text-white mb-2">
        <Link href="/directory">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
        </Link>
      </Button>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-100">{api.name}</h1>
          <Badge variant="outline" className="bg-teal-500/10 text-teal-400 border-teal-500/20 text-sm whitespace-nowrap">
            {api.priceUsdc.toString()} USDC / call
          </Badge>
        </div>
        <p className="text-xl text-zinc-400">{api.description || "No description provided."}</p>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-start gap-3 text-amber-200">
        <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-400" />
        <div>
          <h4 className="font-medium text-amber-400 text-base">Demo Only</h4>
          <p className="text-sm mt-1 text-amber-200/80 leading-relaxed">
            This API is provided for demonstration purposes only on the Stellar testnet. 
            Do not use real funds or expect production-level uptime from this endpoint.
          </p>
        </div>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
          <CardDescription>Make a POST request to this endpoint with a valid x402 payment signature.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-zinc-950 p-4 rounded-md border border-zinc-800">
            <p className="text-sm text-zinc-500 mb-2 font-mono uppercase tracking-wider">Endpoint</p>
            <code className="text-violet-400 font-mono flex items-center bg-violet-500/10 w-fit px-2 py-1 rounded">
              <TerminalSquare className="h-4 w-4 mr-2" />
              POST {baseUrl}/api/x/{api.slug}
            </code>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium text-zinc-200">Using @x402/fetch</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              The easiest way to call this API programmatically in TypeScript/JavaScript is by using the official <code>@x402/fetch</code> package. It automatically intercepts 402 Payment Required responses, signs the required transaction on the Stellar testnet using your wallet, and retries the request seamlessly.
            </p>
            <pre className="bg-zinc-950 p-4 rounded-md border border-zinc-800 text-sm font-mono text-zinc-300 overflow-x-auto leading-relaxed">
{`import { x402Client } from "@x402/core";
import { ExactStellarScheme, createEd25519Signer } from "@x402/stellar";
import { wrapFetchWithPayment } from "@x402/fetch";

// 1. Initialize your wallet signer (Testnet)
const signer = createEd25519Signer("YOUR_STELLAR_SECRET_KEY", "stellar:testnet");
const scheme = new ExactStellarScheme([signer]);

// 2. Wrap your standard fetch client
const client = new x402Client({ schemes: [scheme] });
const payFetch = wrapFetchWithPayment(fetch, client);

// 3. Make the request — payment is handled automatically!
const response = await payFetch("${baseUrl}/api/x/${api.slug}", {
  method: "POST",
  body: JSON.stringify({ query: "example" })
});

const data = await response.json();
console.log(data);`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
