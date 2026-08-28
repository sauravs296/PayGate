import Link from "next/link";
import { getBaseUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PublicNav } from "@/components/PublicNav";
import {
  ArrowRight,
  Zap,
  Shield,
  Code2,
  Globe,
  Terminal,
  ChevronRight,
  BookOpen,
} from "lucide-react";

export const metadata = {
  title: "PayGate — Pay-Per-Call API Marketplace on Stellar",
  description:
    "Monetize or consume APIs with instant micropayments on Stellar. No subscriptions, no invoices — just pay per call using the x402 protocol.",
};

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Code2,
    title: "Developer lists an API",
    desc: "Register any HTTP endpoint in seconds. PayGate wraps it with an x402 payment gate and gives you a public endpoint, docs, and a live analytics dashboard.",
  },
  {
    step: "02",
    icon: Zap,
    title: "Caller hits the endpoint",
    desc: "An AI agent or human sends a request. PayGate intercepts, returns a 402 Payment Required with a Stellar payment requirement embedded in the header.",
  },
  {
    step: "03",
    icon: Shield,
    title: "Payment settles on Stellar",
    desc: "The caller's wallet signs a micropayment — no subscriptions, no invoices. The Soroban facilitator verifies and settles the transaction in seconds.",
  },
  {
    step: "04",
    icon: Globe,
    title: "Request is proxied",
    desc: "Once payment is verified, PayGate forwards the request to the developer's real backend and returns the response. The developer earns USDC instantly.",
  },
];

export default async function LandingPage() {
  const baseUrl = getBaseUrl();

  return (
    <div className="min-h-screen bg-[#080810] text-zinc-50">
      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <PublicNav />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-28 px-4 overflow-hidden">
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#7c3aed33_0%,_transparent_60%)] pointer-events-none" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            Powered by x402 &amp; Stellar
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6 bg-gradient-to-br from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            The Pay-Per-Call<br />API Gateway
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Monetize any HTTP endpoint in seconds. AI agents and developers pay{" "}
            <span className="text-white font-medium">per request</span> using
            real Stellar micropayments. No subscriptions, no billing cycles — just
            instant USDC settlements.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white shadow-xl shadow-violet-500/20 px-8"
            >
              <Link href="/login">
                Start Monetizing <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white px-8"
            >
              <Link href="/documentation">
                Read Docs <BookOpen className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Code preview strip ───────────────────────────────────────────── */}
      <section className="py-8 px-4 border-y border-zinc-800/50 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="h-4 w-4 text-violet-400" />
            <span className="text-sm text-zinc-500 font-mono">3 lines to monetize any API</span>
          </div>
          <pre className="text-sm font-mono overflow-x-auto text-zinc-300 leading-relaxed">
            <span className="text-zinc-600">{"// Before: a normal fetch"}</span>{"\n"}
            <span className="text-blue-400">{"const"}</span>{" response = "}<span className="text-yellow-400">{"await"}</span>{" fetch(url);"}
            {"\n\n"}
            <span className="text-zinc-600">{"// After: wrap once, pay automatically forever"}</span>{"\n"}
            <span className="text-blue-400">{"const"}</span>{" payFetch = "}<span className="text-teal-400">wrapFetchWithPayment</span>{"(fetch, client);"}
            {"\n"}
            <span className="text-blue-400">{"const"}</span>{" response = "}<span className="text-yellow-400">{"await"}</span>{" payFetch("}<span className="text-green-400">{`"${baseUrl}/api/x/your-api"`}</span>{");"}
          </pre>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How PayGate Works</h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              The full payment lifecycle happens automatically — from API call to USDC settlement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-violet-500/40 hover:bg-zinc-900 transition-all group"
              >
                <div className="text-5xl font-black text-zinc-800 group-hover:text-violet-900 transition-colors mb-4 select-none">
                  {item.step}
                </div>
                <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-4">
                  <item.icon className="h-5 w-5 text-violet-400" />
                </div>
                <h3 className="font-semibold text-zinc-100 mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-900/20 to-zinc-900/50 p-10 text-center flex flex-col justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                For Developers
              </h2>
              <p className="text-zinc-400 mb-8">
                Connect your Stellar wallet, register your endpoint, and start
                earning USDC per call — in under 5 minutes.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-violet-600 to-teal-600 hover:from-violet-500 hover:to-teal-500 text-white shadow-xl shadow-violet-500/20 w-full"
            >
              <Link href="/login">
                Start Monetizing <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-900/20 to-zinc-900/50 p-10 text-center flex flex-col justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                For Buyers & AI Agents
              </h2>
              <p className="text-zinc-400 mb-8">
                Discover ready-to-use premium APIs. Test them live in the browser using the built-in PayGate Playground.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10 hover:text-teal-300 w-full"
            >
              <Link href="/marketplace">
                Explore Marketplace <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800/50 py-8 px-4 text-center text-sm text-zinc-600">
        <p>
          © {new Date().getFullYear()} PayGate · Built on{" "}
          <a href="https://stellar.org" target="_blank" rel="noreferrer" className="hover:text-zinc-400 transition-colors">
            Stellar
          </a>{" "}
          &amp;{" "}
          <a href="https://x402.org" target="_blank" rel="noreferrer" className="hover:text-zinc-400 transition-colors">
            x402
          </a>
        </p>
      </footer>
    </div>
  );
}
