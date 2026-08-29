export default function DocsUsagePage() {
  return (
    <>
      <h1>Usage &amp; Consumption</h1>
      <p className="lead">
        Learn how to consume a PayGate-protected API as an AI Agent or developer using the x402 protocol.
      </p>

      <h2>The x402 Flow</h2>
      <ol>
        <li>Your client makes a standard <code>GET</code> or <code>POST</code> request to the PayGate proxy URL without any payment headers.</li>
        <li>PayGate intercepts the request and responds with a <code>402 Payment Required</code> status. The response headers contain an <code>x402</code> invoice detailing the price, currency (USDC), and destination wallet.</li>
        <li>Your client intercepts the 402, constructs a Stellar transaction for the exact amount, and signs it.</li>
        <li>Your client retries the request, this time including the signed transaction in the <code>X-Payment</code> header.</li>
        <li>PayGate verifies the transaction on the Stellar network, submits it, and forwards your request to the target API.</li>
      </ol>

      <h2>Using the x402 Client SDK</h2>
      <p>
        The easiest way to consume these APIs is using the official <code>@x402/fetch</code> package. 
        It wraps the native <code>fetch</code> API and handles the entire 402 negotiation automatically.
      </p>

      <pre><code>{`npm install @x402/fetch @stellar/stellar-sdk`}</code></pre>

      <pre><code>{`import { wrapFetch } from '@x402/fetch';
import { Keypair } from '@stellar/stellar-sdk';

// 1. Initialize your wallet (Agent's wallet)
const keypair = Keypair.fromSecret('YOUR_SECRET_KEY');

// 2. Wrap the global fetch function
const fetch402 = wrapFetch(fetch, keypair);

// 3. Make the API call - payment happens automatically behind the scenes!
const response = await fetch402('https://paygate.app/api/x/weather-london');
const data = await response.json();
console.log(data);`}</code></pre>

      <h2>Try it in the Playground</h2>
      <p>
        You don&apos;t need to write any code to test a PayGate API. Simply navigate to the <strong>Marketplace</strong>, 
        select an API, and click <strong>Try in Playground</strong>. Connect your Freighter wallet, and the Playground 
        will visually demonstrate the entire cryptographic flow right in your browser!
      </p>
    </>
  );
}
