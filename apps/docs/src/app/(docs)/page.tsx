import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Introduction — PayGate Docs",
  description: "PayGate is the open standard for AI-to-API micro-payments on the Stellar network using the x402 protocol.",
};

export default function DocsIntroPage() {
  return (
    <>
      <h1>Introduction</h1>
      <p className="lead">
        PayGate is the open protocol for autonomous AI-to-API micro-payments on the Stellar network.
        It enables AI agents and developers to pay for API access programmatically using the <strong>x402 protocol</strong> and USDC stablecoin — with zero manual intervention.
      </p>

      <h2>The Problem</h2>
      <p>
        The modern API economy is designed for humans. When an autonomous AI agent needs access to a premium API, it encounters a hard wall:
      </p>
      <ul>
        <li>It cannot hold a credit card or bank account.</li>
        <li>It cannot sign up for a SaaS subscription.</li>
        <li>It cannot store and rotate API keys safely.</li>
      </ul>
      <p>
        A human developer must manually intervene — entering billing details, generating API keys, and hardcoding secrets into the agent. <strong>This breaks the autonomy of AI.</strong>
      </p>

      <h2>The Solution</h2>
      <p>
        PayGate implements the <a href="https://x402.org" target="_blank" rel="noopener noreferrer">HTTP 402 Payment Required</a> standard to create a native, machine-readable payment layer for APIs:
      </p>
      <ol>
        <li>An AI agent calls a PayGate-protected API endpoint.</li>
        <li>PayGate responds with <code>402 Payment Required</code> and a signed invoice in the <code>x402</code> header.</li>
        <li>The agent reads the invoice, constructs a USDC micro-transaction on Stellar, and retries the request.</li>
        <li>PayGate verifies the payment on-chain and forwards the request to the developer&apos;s backend.</li>
      </ol>

      <h2>Who Is This For?</h2>

      <h3>API Developers</h3>
      <p>
        Turn any backend URL into a monetized, publicly-discoverable API in minutes. No billing infrastructure, no API key management. Register your endpoint, set a price per call in USDC, and PayGate handles the rest.
      </p>

      <h3>AI Agent Builders</h3>
      <p>
        Give your agents access to premium data sources with a single line of code. The <code>@x402/fetch</code> SDK wraps the native <code>fetch</code> API and handles the entire payment negotiation transparently.
      </p>

      <hr />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose mt-6">
        <Link href="/features" className="group block p-4 border border-zinc-800 rounded-lg bg-zinc-900/50 hover:bg-zinc-800 transition-colors">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Next</p>
          <h4 className="font-semibold text-zinc-100 flex items-center gap-2">
            Features &amp; Architecture <ArrowRight className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </h4>
          <p className="text-sm text-zinc-400 mt-1">Core features, SEP-10 auth, Soroban contracts, and real-time analytics.</p>
        </Link>
        <Link href="/setup" className="group block p-4 border border-zinc-800 rounded-lg bg-zinc-900/50 hover:bg-zinc-800 transition-colors">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Developer Guide</p>
          <h4 className="font-semibold text-zinc-100 flex items-center gap-2">
            Developer Setup <ArrowRight className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </h4>
          <p className="text-sm text-zinc-400 mt-1">List your API and start earning USDC in 5 minutes.</p>
        </Link>
      </div>
    </>
  );
}
