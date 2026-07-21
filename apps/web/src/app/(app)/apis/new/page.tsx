import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createApiAction } from "@/server/actions/api-actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewApiPage() {
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
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-zinc-800 bg-zinc-900 px-3 text-zinc-500 sm:text-sm">
              paygate.xyz/api/x/
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
          <Label htmlFor="description" className="text-zinc-300">Description (Optional)</Label>
          <Input id="description" name="description" placeholder="Short description of what the API does" className="bg-zinc-950 border-zinc-800 focus-visible:ring-violet-500" />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-zinc-800 p-4 bg-zinc-950">
          <div className="space-y-0.5">
            <Label htmlFor="isListed" className="text-base text-zinc-200">Public Directory</Label>
            <p className="text-sm text-zinc-500">
              List this API in the public directory for others to discover.
            </p>
          </div>
          <Switch id="isListed" name="isListed" defaultChecked />
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

