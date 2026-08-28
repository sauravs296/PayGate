import { getActiveApiBySlug } from "@/lib/db/apis";
import { notFound } from "next/navigation";
import { PlaygroundClient } from "@/components/Playground/PlaygroundClient";
import { getBaseUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PlaygroundPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const decodedSlug = decodeURIComponent(params.slug);
  const api = await getActiveApiBySlug(decodedSlug);

  if (!api) {
    notFound();
  }

  const baseUrl = getBaseUrl();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-50 flex flex-col">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-[#0a0a0f] to-[#0a0a0f] pointer-events-none -z-10" />

      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full mt-12">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-300 mb-6">
            Live x402 Payment Demo
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Test <span className="text-violet-400">{api.name}</span> in the Browser
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Connect your Freighter wallet to experience the buyer flow. 
            Watch PayGate intercept the request, prompt for a micro-payment signature, and seamlessly fetch the data.
          </p>
        </div>

        <PlaygroundClient 
          apiSlug={api.slug} 
          apiName={api.name} 
          priceUsdc={Number(api.priceUsdc)} 
          baseUrl={baseUrl} 
        />
      </main>
    </div>
  );
}
