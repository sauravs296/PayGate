import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getBaseUrl } from "@/lib/utils";
import { NewApiForm } from "./client-form";

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

      <NewApiForm baseUrl={baseUrl} />
    </div>
  );
}
