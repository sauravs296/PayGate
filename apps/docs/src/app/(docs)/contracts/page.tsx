import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Smart Contracts — PayGate Docs",
};

export default function DocsContractsPage() {
  return (
    <>
      <h1>Smart Contracts</h1>
      <p className="lead">
        PayGate is powered by three Soroban smart contracts deployed on the Stellar network. All contracts operate trustlessly — they cannot be altered or paused by the PayGate team after deployment.
      </p>

      <h2>Deployed Contracts (Testnet)</h2>
      <div className="not-prose overflow-x-auto rounded-lg border border-zinc-800 mb-8">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800">
            <tr>
              <th className="px-4 py-3 font-medium">Contract</th>
              <th className="px-4 py-3 font-medium">Contract ID (Testnet)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            <tr>
              <td className="px-4 py-3 font-medium text-zinc-100">Receipt Verifier</td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-400">CBUGM2OM6Z3XSRTVN3Y4LI6SH3CXW2GUKNQL2FQKNERABFCNDT7DXRGI</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-zinc-100">PayGate Router</td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-400">CDHAMAEXMNLHUDBF5EKF3OYYPHIRUOWWSSW6ML4ANDDRESHGTVGMRO3L</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-zinc-100">PayGate Reputation</td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-400">CDEXJVXD4AAT73DDSEOEOCFZZFSYBKZAJFQ37EYFG3TS57F7E25HHHA6</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>PayGate Router</h2>
      <p>
        The Router contract is the economic backbone of the protocol. When an AI agent pays for an API call, the USDC flows through this contract which performs an atomic on-chain split:
      </p>
      <ul>
        <li><strong>90%</strong> is transferred directly to the API Developer&apos;s Stellar wallet address.</li>
        <li><strong>10%</strong> goes to the Protocol Treasury wallet for ongoing protocol development.</li>
      </ul>
      <p>
        The split happens in a single Soroban invocation using the <strong>Stellar Asset Contract (SAC) token client</strong>, guaranteeing atomicity — either both transfers succeed, or neither does.
      </p>

      <h2>PayGate Reputation</h2>
      <p>
        The Reputation contract is an on-chain staking system. To list an API in the public marketplace, a developer must call the <code>stake_api(developer_address, api_id, amount)</code> function and lock up <code>1 USDC</code>.
      </p>
      <p>
        This creates a financial deterrent against spam and malicious APIs. The contract emits the following Soroban events:
      </p>
      <ul>
        <li><code>staked</code> — emitted when a developer stakes USDC to list an API.</li>
        <li><code>voted</code> — emitted when a user votes on an API&apos;s quality.</li>
        <li><code>unstaked</code> — emitted when a developer withdraws their stake.</li>
      </ul>
      <p>
        These events are picked up in real-time by the PayGate backend Soroban event indexer, keeping the marketplace perfectly in sync with on-chain state.
      </p>

      <h2>Receipt Verifier</h2>
      <p>
        Every successful payment verification is logged immutably to this contract. It provides an auditable, tamper-proof proof-of-payment trail that any developer or user can verify independently on the Stellar network.
      </p>

      <h2>Local Development</h2>
      <p>To run the contracts locally or run the test suite:</p>
      <pre><code>{`# Clone the repository
git clone https://github.com/sauravs296/PayGate.git
cd PayGate/contracts

# Run all Soroban unit tests
cargo test --workspace

# Build the contracts to WASM
cargo build --target wasm32-unknown-unknown --release`}</code></pre>

      <hr />

      <div className="grid grid-cols-2 gap-4 not-prose mt-6">
        <Link href="/usage" className="group block p-4 border border-zinc-800 rounded-lg bg-zinc-900/50 hover:bg-zinc-800 transition-colors">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Previous</p>
          <h4 className="font-semibold text-zinc-100 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" /> Usage &amp; Consumption
          </h4>
        </Link>
        <div />
      </div>
    </>
  );
}
