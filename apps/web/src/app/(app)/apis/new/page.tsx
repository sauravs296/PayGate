import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createApiAction } from "@/server/actions/api-actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getBaseUrl } from "@/lib/utils";

export default async function NewApiPage() {
  const baseUrl = getBaseUrl();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="text-zinc-400 hover:text-white hover:bg-zinc-800">
          <Link href="/apis">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Register New API</h1>
          <p className="text-zinc-400 mt-1">
            Expose a backend route through the PayGate proxy.
          </p>
        </div>
      </div>

      <form action={createApiAction} className="space-y-6 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-zinc-300">API Name</Label>
          <Input id="name" name="name" required placeholder="e.g., Weather Data API" className="bg-zinc-950 border-zinc-800 focus-visible:ring-violet-500" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug" className="text-zinc-300">URL Slug</Label>
          <div className="flex rounded-md shadow-sm">
            <span className="bg-zinc-800 text-zinc-400 px-3 py-2 rounded-l-md border border-r-0 border-zinc-700 font-mono text-sm">
              {baseUrl.replace(/^https?:\/\//, '')}/api/x/
            </span>
            <Input 
              id="slug" 
              name="slug" 
              required 
              placeholder="weather-api" 
              className="rounded-l-none bg-zinc-950 border-zinc-800 focus-visible:ring-violet-500" 
              pattern="[a-zA-Z0-9-]+"
              title="Only lowercase letters, numbers, and hyphens"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetUrl" className="text-zinc-300">Target Backend URL</Label>
          <Input id="targetUrl" name="targetUrl" type="url" required placeholder="https://api.yourdomain.com/v1/weather" className="bg-zinc-950 border-zinc-800 focus-visible:ring-violet-500" />
          <p className="text-xs text-zinc-500">PayGate will forward paid requests to this URL.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priceUsdc" className="text-zinc-300">Price per Call (USDC)</Label>
          <Input id="priceUsdc" name="priceUsdc" type="number" step="0.0001" min="0.0001" required placeholder="0.05" className="bg-zinc-950 border-zinc-800 focus-visible:ring-violet-500" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-zinc-300">Description / Documentation Link (Optional)</Label>
          <Input id="description" name="description" placeholder="Short description or link to your API docs (e.g. https://...)" className="bg-zinc-950 border-zinc-800 focus-visible:ring-violet-500" />
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 p-4 rounded-lg text-sm flex gap-3">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>
            <strong>Note:</strong> Currently, PayGate only supports APIs that return JSON responses. 
            Image APIs and other formats are not fully supported and will not render correctly in the Playground.
          </p>
        </div>



        <div className="pt-4 flex justify-end gap-3">
          <Button variant="ghost" asChild className="text-zinc-400 hover:text-white hover:bg-zinc-800">
            <Link href="/apis">Cancel</Link>
          </Button>
          <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white">
            Register API
          </Button>
        </div>
      </form>
    </div>
  );
}

