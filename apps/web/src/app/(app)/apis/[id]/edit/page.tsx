import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateApiAction } from "@/server/actions/api-actions";
import { getApiById } from "@/lib/db/apis";
import { getSession } from "@/lib/auth/session";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditApiPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  const api = await getApiById(params.id, session.developerId);

  if (!api) {
    notFound();
  }

  // Next.js server actions need bind for extra arguments
  const updateActionWithId = updateApiAction.bind(null, api.id);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="text-zinc-400 hover:text-white hover:bg-zinc-800">
          <Link href={`/apis/${api.id}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit API</h1>
          <p className="text-zinc-400 mt-1">
            Update settings for /{api.slug}
          </p>
        </div>
      </div>

      <form action={updateActionWithId} className="space-y-6 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-zinc-300">API Name</Label>
          <Input id="name" name="name" defaultValue={api.name} required className="bg-zinc-950 border-zinc-800 focus-visible:ring-violet-500" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug" className="text-zinc-300">URL Slug</Label>
          <Input id="slug" disabled value={api.slug} className="bg-zinc-950 border-zinc-800 text-zinc-500" />
          <p className="text-xs text-zinc-500">Slugs cannot be changed after creation.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetUrl" className="text-zinc-300">Target Backend URL</Label>
          <Input id="targetUrl" name="targetUrl" type="url" defaultValue={api.targetUrl} required className="bg-zinc-950 border-zinc-800 focus-visible:ring-violet-500" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priceUsdc" className="text-zinc-300">Price per Call (USDC)</Label>
          <Input id="priceUsdc" name="priceUsdc" type="number" step="0.0001" min="0.0001" defaultValue={api.priceUsdc.toString()} required className="bg-zinc-950 border-zinc-800 focus-visible:ring-violet-500" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-zinc-300">Description (Optional)</Label>
          <Input id="description" name="description" defaultValue={api.description || ""} className="bg-zinc-950 border-zinc-800 focus-visible:ring-violet-500" />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-zinc-800 p-4 bg-zinc-950">
          <div className="space-y-0.5">
            <Label htmlFor="isListed" className="text-base text-zinc-200">Public Directory</Label>
            <p className="text-sm text-zinc-500">
              List this API in the public directory for others to discover.
            </p>
          </div>
          <Switch id="isListed" name="isListed" defaultChecked={api.isListed} />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-zinc-800 p-4 bg-zinc-950">
          <div className="space-y-0.5">
            <Label htmlFor="isActive" className="text-base text-zinc-200">Active Status</Label>
            <p className="text-sm text-zinc-500">
              If disabled, the proxy will reject all incoming requests.
            </p>
          </div>
          <Switch id="isActive" name="isActive" defaultChecked={api.isActive} />
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button variant="ghost" asChild className="text-zinc-400 hover:text-white hover:bg-zinc-800">
            <Link href={`/apis/${api.id}`}>Cancel</Link>
          </Button>
          <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
