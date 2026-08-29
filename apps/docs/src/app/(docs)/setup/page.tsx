import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Developer Setup — PayGate Docs",
};

export default function DocsSetupPage() {
  return (
    <>
      <h1>Developer Setup</h1>
      <p className="lead">
        Ready to monetize your API? Follow these steps to register your endpoint on PayGate and start earning USDC per API call.
      </p>

      <h2>Prerequisites</h2>
      <ul>
        <li>A <strong>Stellar wallet</strong> — Freighter, LOBSTR, or xBull (browser extension).</li>
        <li>Your wallet must be <strong>funded with XLM</strong> on the Stellar Testnet. Get free testnet XLM from <a href="https://friendbot.stellar.org" target="_blank" rel="noopener noreferrer">Friendbot</a>.</li>
        <li>A publicly accessible <strong>backend API URL</strong> to monetize.</li>
      </ul>

      <h2>Step 1 — Connect Your Wallet</h2>
      <p>
        Navigate to the <a href="https://paygate-stellar-swart.vercel.app/login" target="_blank" rel="noopener noreferrer">Login page</a> and connect your Stellar wallet. PayGate uses <strong>SEP-10</strong> authentication — you will be prompted to sign a challenge transaction. This proves you own the wallet without ever exposing your private keys.
      </p>

      <h2>Step 2 — Register Your API</h2>
      <p>
        In your developer dashboard, click <strong>&ldquo;New API&rdquo;</strong>. Fill in the following fields:
      </p>
      <ul>
        <li><strong>Name</strong> — How your API will appear in the Marketplace (e.g., <code>Real-time Weather API</code>).</li>
        <li><strong>Slug</strong> — A unique URL-safe identifier (e.g., <code>weather-london</code>). This becomes your proxy path.</li>
        <li><strong>Description</strong> — A clear description of what your API returns.</li>
        <li><strong>Target URL</strong> — Your hidden backend URL (e.g., <code>https://api.openweathermap.org/data/2.5/weather?q=London</code>). This is <em>never</em> exposed publicly.</li>
        <li><strong>Price per Call</strong> — The cost in USDC (e.g., <code>0.001</code>).</li>
      </ul>

      <h2>Step 3 — Get Your Proxy URL</h2>
      <p>
        Once created, PayGate generates a public proxy URL for your API:
      </p>
      <pre><code>{`https://paygate-stellar-swart.vercel.app/api/x/<your-slug>`}</code></pre>
      <p>
        Share this URL with your users or AI agents. All payments, routing, and on-chain settlement happen automatically through this endpoint.
      </p>

      <h2>Step 4 — Stake to List in the Marketplace</h2>
      <p>
        To get your API publicly listed in the <a href="https://paygate-stellar-swart.vercel.app/marketplace" target="_blank" rel="noopener noreferrer">Marketplace</a> so other developers and agents can discover it, you must stake <code>1 USDC</code> into the PayGate Reputation contract.
      </p>
      <p>
        Navigate to your API details page and click <strong>&ldquo;Stake to Publish&rdquo;</strong>. Your wallet will prompt you to approve the Soroban smart contract invocation. This is a one-time stake that signals quality and prevents spam.
      </p>

      <h2>Step 5 — Monitor Earnings</h2>
      <p>
        Your dashboard provides real-time analytics for every API you own:
      </p>
      <ul>
        <li>Total calls received and earnings in USDC.</li>
        <li>A live feed of recent API hits.</li>
        <li>An <strong>&ldquo;Auto-Settled&rdquo;</strong> badge linking directly to your on-chain transaction history on Stellar Expert, verifying that funds have been settled to your wallet.</li>
      </ul>

      <hr />

      <div className="grid grid-cols-2 gap-4 not-prose mt-6">
        <Link href="/features" className="group block p-4 border border-zinc-800 rounded-lg bg-zinc-900/50 hover:bg-zinc-800 transition-colors">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Previous</p>
          <h4 className="font-semibold text-zinc-100 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" /> Features &amp; Architecture
          </h4>
        </Link>
        <Link href="/usage" className="group block p-4 border border-zinc-800 rounded-lg bg-zinc-900/50 hover:bg-zinc-800 transition-colors text-right">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Next</p>
          <h4 className="font-semibold text-zinc-100 flex items-center gap-2 justify-end">
            Usage &amp; Consumption <ArrowRight className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </h4>
        </Link>
      </div>
    </>
  );
}
