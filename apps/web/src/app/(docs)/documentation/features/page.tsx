export default function DocsFeaturesPage() {
  return (
    <>
      <h1>Features &amp; Architecture</h1>
      <p className="lead">
        PayGate is built from the ground up for speed, security, and developer experience.
        Here is a detailed look at the core features of the platform.
      </p>

      <h2>Zero-Config Paywalls</h2>
      <p>
        Turn any backend URL into a monetized API in seconds. You do not need to install an SDK on your backend. 
        PayGate acts as a secure reverse-proxy. Callers hit the PayGate URL, we intercept and verify the payment, 
        and then we forward the clean request to your hidden backend URL.
      </p>

      <h2>Passwordless Auth (SEP-10)</h2>
      <p>
        PayGate uses <strong>SEP-10</strong>, the official Stellar ecosystem standard for authentication. 
        Instead of managing passwords or OAuth tokens, developers log into the PayGate dashboard by cryptographically 
        signing a time-bounded challenge transaction using their Stellar wallet (like Freighter).
      </p>

      <h2>Soroban Smart Contracts</h2>
      <p>
        PayGate heavily utilizes Soroban (Stellar&apos;s smart contract platform) to ensure decentralized, trustless operations:
      </p>
      <ul>
        <li><strong>PayGate Router:</strong> Automatically splits incoming API payments on-chain between the developer and the protocol treasury.</li>
        <li><strong>PayGate Reputation:</strong> A staking contract where developers lock up USDC to list their APIs in the public directory, curbing spam.</li>
        <li><strong>Receipt Verifier:</strong> Logs successful payment verifications immutably.</li>
      </ul>

      <h2>Dynamic DEX Pricing</h2>
      <p>
        PayGate integrates directly with the Stellar Decentralized Exchange (DEX) and AMM liquidity pools. 
        This allows us to fetch real-time conversion rates (e.g., converting XLM to USDC on the fly) 
        so agents can pay with whatever asset they hold, while developers still receive stable USDC.
      </p>

      <h2>Real-time Analytics</h2>
      <p>
        The developer dashboard provides a live, real-time feed of incoming API calls, earnings, and rate-limiting metrics, 
        powered by Upstash Redis and our Soroban Event Indexer.
      </p>
    </>
  );
}
