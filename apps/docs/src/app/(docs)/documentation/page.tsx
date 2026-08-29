import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DocsIntroPage() {
  return (
    <>
      <h1>Welcome to PayGate Documentation</h1>
      <p className="lead">
        PayGate is the open standard for AI-to-API micro-payments on the Stellar network. 
        It bridges the gap between autonomous software agents and premium API data using the <strong>x402 protocol</strong>.
      </p>

      <h2>The Core Problem</h2>
      <p>
        The current API economy is built for humans and credit cards, not AI agents. When an autonomous AI needs to access premium data (like real-time weather, stock prices, or compute APIs), it hits a paywall. To get past it, a human developer has to manually sign up for an API key, enter a credit card, commit to a monthly subscription, and hardcode that key into the agent.
      </p>
      <p>
        <strong>This breaks the autonomy of AI.</strong> AI agents cannot hold bank accounts or sign up for SaaS subscriptions.
      </p>

      <h2>The Solution: PayGate</h2>
      <p>
        PayGate bridges this gap. When an AI agent requests data from a PayGate-protected API without a payment, the server responds with a standard HTTP <code>402 Payment Required</code> status code, including an <code>x402</code> header containing a crypto invoice.
      </p>
      <p>
        The agent automatically intercepts this 402, constructs a micro-transaction on the Stellar network using its own built-in crypto wallet, and retries the request with the transaction signature attached. PayGate verifies the payment instantly and serves the data.
      </p>

      <hr />

      <h3>What&apos;s Next?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose mt-6">
        <Link href="/documentation/features" className="group block p-4 border border-zinc-800 rounded-xl bg-zinc-900/50 hover:bg-zinc-800 transition-colors">
          <h4 className="font-semibold text-zinc-100 mb-1 flex items-center">
            Features &amp; Architecture <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h4>
          <p className="text-sm text-zinc-400">Deep dive into how PayGate works under the hood.</p>
        </Link>
        <Link href="/documentation/setup" className="group block p-4 border border-zinc-800 rounded-xl bg-zinc-900/50 hover:bg-zinc-800 transition-colors">
          <h4 className="font-semibold text-zinc-100 mb-1 flex items-center">
            Developer Setup <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h4>
          <p className="text-sm text-zinc-400">List your API and start earning USDC in 5 minutes.</p>
        </Link>
      </div>
    </>
  );
}
