export default function DocsContractsPage() {
  return (
    <>
      <h1>Smart Contracts</h1>
      <p className="lead">
        PayGate is powered by a suite of Soroban smart contracts deployed on the Stellar network to guarantee decentralized and trustless operations.
      </p>

      <h2>Deployed Contracts (Testnet)</h2>
      <div className="not-prose overflow-x-auto rounded-xl border border-zinc-800 mb-8">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-900/50 text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Contract Name</th>
              <th className="px-4 py-3 font-medium">Contract ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            <tr className="bg-[#080810]">
              <td className="px-4 py-3 font-medium text-violet-400">Receipt Verifier</td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-500">CBUGM2OM6Z3XSRTVN3Y4LI6SH3CXW2GUKNQL2FQKNERABFCNDT7DXRGI</td>
            </tr>
            <tr className="bg-[#080810]">
              <td className="px-4 py-3 font-medium text-teal-400">PayGate Router</td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-500">CDHAMAEXMNLHUDBF5EKF3OYYPHIRUOWWSSW6ML4ANDDRESHGTVGMRO3L</td>
            </tr>
            <tr className="bg-[#080810]">
              <td className="px-4 py-3 font-medium text-amber-400">PayGate Reputation</td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-500">CDEXJVXD4AAT73DDSEOEOCFZZFSYBKZAJFQ37EYFG3TS57F7E25HHHA6</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>PayGate Router</h2>
      <p>
        The Router contract is responsible for automatically splitting incoming API payments. 
        When an AI agent pays for an API call, the funds are routed through this contract, which utilizes 
        the standard Stellar Asset Contract (SAC) token client to split the USDC:
      </p>
      <ul>
        <li><strong>90%</strong> goes directly to the API Developer&apos;s wallet.</li>
        <li><strong>10%</strong> goes to the Protocol Treasury.</li>
      </ul>

      <h2>PayGate Reputation</h2>
      <p>
        The Reputation contract is an on-chain staking system. To list an API in the public marketplace, 
        a developer must call the <code>stake_api</code> function and lock up 1 USDC. 
      </p>
      <p>
        This creates a financial deterrent against spam and malicious APIs. 
        The contract also emits Soroban RPC events (<code>staked</code>, <code>voted</code>, <code>unstaked</code>) 
        which are picked up by our backend indexer to keep the frontend marketplace perfectly synced with the blockchain state.
      </p>
    </>
  );
}
