import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Features & Architecture — PayGate Docs",
};

export default function DocsFeaturesPage() {
  return (
    <>
      <h1>Features &amp; Architecture</h1>
      <p className="lead">
        PayGate is built from the ground up for trustless, autonomous API monetization. Here is an in-depth look at the core technical features.
      </p>

      <h2>Zero-Config Paywalls</h2>
      <p>
        Turn any backend URL into a monetized API in seconds — no SDK installation required on your backend. PayGate acts as a secure reverse proxy:
      </p>
      <ol>
        <li>You register your hidden backend URL in the PayGate dashboard.</li>
        <li>PayGate gives you a public proxy URL (e.g., <code>https://paygate.app/api/x/your-slug</code>).</li>
        <li>Callers hit the proxy URL. PayGate intercepts, verifies payment, then forwards the clean request to your backend.</li>
        <li>Your backend never needs to know about payments — it just serves data as normal.</li>
      </ol>

      <h2>Passwordless Auth via SEP-10</h2>
      <p>
        PayGate uses <strong>SEP-10</strong>, the official Stellar ecosystem standard for authentication. There are no passwords or OAuth tokens. Developers log in by cryptographically signing a time-bounded challenge transaction using their Stellar wallet (Freighter, LOBSTR, xBull, etc.).
      </p>
      <p>
        This means:
      </p>
      <ul>
        <li><strong>No password databases</strong> — credentials cannot be stolen from PayGate servers.</li>
        <li><strong>Wallet-native UX</strong> — login works with any Stellar wallet via the Wallet Kit.</li>
        <li><strong>Automatic session expiry</strong> — challenge transactions are short-lived and cannot be replayed.</li>
      </ul>

      <h2>Soroban Smart Contracts</h2>
      <p>
        PayGate uses three Soroban (Stellar&apos;s smart contract platform) contracts to ensure decentralized, trustless operation. None of these contracts can be altered by the PayGate team after deployment.
      </p>
      <ul>
        <li>
          <strong>PayGate Router:</strong> Receives every API payment and automatically splits it —
          <code> 90%</code> to the API developer&apos;s wallet and <code>10%</code> to the protocol treasury — in a single atomic on-chain transaction.
        </li>
        <li>
          <strong>PayGate Reputation:</strong> Developers must stake <code>1 USDC</code> via the <code>stake_api</code> function to list in the public marketplace, creating a financial deterrent against spam.
        </li>
        <li>
          <strong>Receipt Verifier:</strong> Logs every successful payment verification immutably on-chain. Provides an auditable proof-of-payment trail.
        </li>
      </ul>
      <p>
        All three contracts emit Soroban RPC events (<code>staked</code>, <code>voted</code>, <code>payment_verified</code>) which are consumed by the PayGate backend event indexer to keep the frontend in sync with blockchain state without polling.
      </p>

      <h2>Dynamic DEX Pricing</h2>
      <p>
        PayGate integrates with the Stellar Decentralized Exchange (DEX) and AMM liquidity pools to fetch real-time conversion rates. This allows agents to pay with any Stellar asset they hold (XLM, USDC, etc.), while developers always receive stable USDC.
      </p>

      <h2>Real-Time Analytics Dashboard</h2>
      <p>
        The developer dashboard provides a live feed of API calls and earnings, powered by:
      </p>
      <ul>
        <li><strong>Upstash Redis</strong> — for a real-time per-API call counter with sub-millisecond latency.</li>
        <li><strong>Soroban Event Indexer</strong> — a background service that listens for on-chain contract events and syncs them to the database.</li>
        <li><strong>Neon Postgres</strong> — the persistent store for API definitions, earnings history, and developer accounts.</li>
      </ul>

      <h2>API Rate Limiting</h2>
      <p>
        Every PayGate proxy endpoint is automatically protected by Upstash&apos;s sliding-window rate limiter. Requests that pass payment verification are still subject to configurable per-IP rate limits, preventing abuse.
      </p>

      <hr />

      <div className="grid grid-cols-2 gap-4 not-prose mt-6">
        <Link href="/" className="group block p-4 border border-zinc-800 rounded-lg bg-zinc-900/50 hover:bg-zinc-800 transition-colors">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Previous</p>
          <h4 className="font-semibold text-zinc-100 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" /> Introduction
          </h4>
        </Link>
        <Link href="/setup" className="group block p-4 border border-zinc-800 rounded-lg bg-zinc-900/50 hover:bg-zinc-800 transition-colors text-right">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Next</p>
          <h4 className="font-semibold text-zinc-100 flex items-center gap-2 justify-end">
            Developer Setup <ArrowRight className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </h4>
        </Link>
      </div>
    </>
  );
}
