import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Usage & Consumption — PayGate Docs",
};

export default function DocsUsagePage() {
  return (
    <>
      <h1>Usage &amp; Consumption</h1>
      <p className="lead">
        Learn how to consume a PayGate-protected API as an AI Agent or developer using the x402 protocol and the official SDK.
      </p>

      <h2>The x402 Payment Flow</h2>
      <p>Every PayGate-protected API follows this deterministic, machine-readable flow:</p>
      <ol>
        <li>Your client makes a standard <code>GET</code> or <code>POST</code> request to the PayGate proxy URL — no special headers needed.</li>
        <li>PayGate responds with <code>402 Payment Required</code>. The response body contains an <code>x402</code> invoice with the exact price, currency (USDC), and destination wallet.</li>
        <li>Your client reads the invoice, constructs a Stellar USDC transaction, signs it with your wallet keypair.</li>
        <li>Your client retries the original request, this time attaching the signed transaction in the <code>X-Payment</code> header.</li>
        <li>PayGate verifies the transaction on the Stellar network, submits it, and forwards your request to the target API. The developer is paid instantly on-chain.</li>
      </ol>

      <h2>Option 1 — SDK (Recommended)</h2>
      <p>
        The easiest integration is the official <code>@x402/fetch</code> package. It wraps the native <code>fetch</code> API and handles the entire 402 negotiation automatically — your code never needs to know about wallets or Stellar transactions.
      </p>

      <h3>Install</h3>
      <pre><code>{`npm install @x402/fetch @stellar/stellar-sdk`}</code></pre>

      <h3>TypeScript / JavaScript</h3>
      <pre><code>{`import { wrapFetch } from '@x402/fetch';
import { Keypair } from '@stellar/stellar-sdk';

// 1. Load your agent's Stellar keypair
const keypair = Keypair.fromSecret(process.env.AGENT_SECRET_KEY!);

// 2. Wrap the global fetch with automatic x402 payment handling
const fetch402 = wrapFetch(fetch, keypair);

// 3. Call any PayGate-protected endpoint — payment is fully automatic
const response = await fetch402(
  'https://paygate-stellar-swart.vercel.app/api/x/your-api-slug'
);
const data = await response.json();
console.log(data);`}</code></pre>

      <h2>Option 2 — Manual HTTP</h2>
      <p>
        If you are not using JavaScript/TypeScript, you can implement the x402 protocol manually in any language that supports HTTP and the Stellar SDK.
      </p>
      <pre><code>{`# Step 1: Initial request (will receive 402)
GET https://paygate-stellar-swart.vercel.app/api/x/<slug>
# Response: 402 Payment Required
# Response body: { "x402Version": 1, "accepts": [{ "scheme": "exact", "network": "stellar:testnet", "maxAmountRequired": "0.001", "asset": "USDC", "payTo": "G..." }] }

# Step 2: Construct and sign the Stellar transaction, then retry
GET https://paygate-stellar-swart.vercel.app/api/x/<slug>
X-Payment: <base64-encoded-signed-stellar-transaction>
# Response: 200 OK + API data`}</code></pre>

      <h2>Option 3 — Try in the Playground</h2>
      <p>
        No code required. Navigate to the <a href="https://paygate-stellar-swart.vercel.app/marketplace" target="_blank" rel="noopener noreferrer">Marketplace</a>, select any listed API, and click <strong>&ldquo;Try in Playground&rdquo;</strong>. The Playground visually demonstrates the entire cryptographic payment flow — including the 402 challenge, transaction construction, and the final API response — right in your browser.
      </p>

      <h2>Environment Variables</h2>
      <p>For production agent deployments, store your Stellar secret key as an environment variable:</p>
      <pre><code>{`# .env
AGENT_SECRET_KEY=S...  # Your agent's Stellar secret key (starts with S)

# Never commit this to version control!`}</code></pre>

      <hr />

      <div className="grid grid-cols-2 gap-4 not-prose mt-6">
        <Link href="/setup" className="group block p-4 border border-zinc-800 rounded-lg bg-zinc-900/50 hover:bg-zinc-800 transition-colors">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Previous</p>
          <h4 className="font-semibold text-zinc-100 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" /> Developer Setup
          </h4>
        </Link>
        <Link href="/contracts" className="group block p-4 border border-zinc-800 rounded-lg bg-zinc-900/50 hover:bg-zinc-800 transition-colors text-right">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Next</p>
          <h4 className="font-semibold text-zinc-100 flex items-center gap-2 justify-end">
            Smart Contracts <ArrowRight className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </h4>
        </Link>
      </div>
    </>
  );
}
