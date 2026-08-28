export default function DocsSetupPage() {
  return (
    <>
      <h1>Developer Setup</h1>
      <p className="lead">
        Ready to monetize your API? Follow these steps to register your endpoint and get listed on the PayGate marketplace.
      </p>

      <h3>1. Connect Your Wallet</h3>
      <p>
        Navigate to the <strong>Login</strong> page and connect your Stellar wallet (like Freighter). 
        You will be prompted to sign a SEP-10 challenge transaction. This proves you own the wallet without 
        exposing your private keys.
      </p>

      <h3>2. Register Your API</h3>
      <p>
        In your developer dashboard, click <strong>Create API</strong>. You will need to provide:
      </p>
      <ul>
        <li><strong>Name &amp; Description:</strong> How your API will appear in the marketplace.</li>
        <li><strong>Target URL:</strong> Your actual backend URL (e.g., <code>https://api.myweatherapp.com/v1</code>). This is kept secret.</li>
        <li><strong>Price:</strong> The cost per call in USDC.</li>
      </ul>

      <h3>3. Stake to Publish (Optional but Recommended)</h3>
      <p>
        To get your API listed in the public marketplace, you must stake <strong>1 USDC</strong> into the 
        PayGate Reputation Soroban contract. This deters spam and proves your commitment to maintaining a quality API.
      </p>
      <p>
        Navigate to your API details page and click the <strong>Stake to Publish</strong> button. Your wallet 
        will prompt you to approve the smart contract invocation.
      </p>

      <h3>4. Share Your Endpoint</h3>
      <p>
        Once created, you&apos;ll receive a PayGate proxy URL (e.g., <code>https://paygate.app/api/x/your-api</code>). 
        Give this URL to your users. When they call it, PayGate will intercept the call, demand an x402 payment, 
        route the USDC to your wallet via our smart contracts, and forward the request to your Target URL.
      </p>
    </>
  );
}
