/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/playground/[slug]/route.ts
// Server-side buyer agent for the Playground demo.
//
// The browser Playground calls this endpoint. This route acts as the "buyer" —
// it fires the paid x402 request using the pre-funded AGENT_STELLAR_SECRET_KEY
// and streams log events back to the browser via Server-Sent Events (SSE).
//
// Flow:
//   Browser → GET /api/playground/[slug]
//   This route → GET /api/x/[slug]  (gets 402)
//   This route → pays with agent wallet → GET /api/x/[slug] again
//   Streams each step back to the browser as SSE events

import { NextRequest } from "next/server";
import { wrapFetchWithPayment, x402Client } from "@x402/fetch";
import { createEd25519Signer } from "@x402/stellar";
import { ExactStellarScheme } from "@x402/stellar/exact/client";
import { getActiveApiBySlug } from "@/lib/db/apis";
import { getBaseUrl } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { slug } = await params;

  const agentSecret = process.env.AGENT_STELLAR_SECRET_KEY;
  if (!agentSecret) {
    return new Response(
      JSON.stringify({ error: "AGENT_STELLAR_SECRET_KEY not configured" }),
      { status: 500 }
    );
  }

  const api = await getActiveApiBySlug(slug);
  if (!api) {
    return new Response(JSON.stringify({ error: "API not found" }), { status: 404 });
  }

  const baseUrl = getBaseUrl();
  const targetUrl = `${baseUrl}/api/x/${slug}`;
  const network = (process.env.STELLAR_NETWORK === "pubnet"
    ? "stellar:pubnet"
    : "stellar:testnet") as `${string}:${string}`;

  // Build SSE stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: object) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      try {
        send("log", { type: "system", msg: `Preparing buyer agent wallet...` });

        const signer = createEd25519Signer(agentSecret, network);
        const scheme = new ExactStellarScheme(signer as ConstructorParameters<typeof ExactStellarScheme>[0]);
        const client = new x402Client().register(network, scheme);

        let attempt = 0;
        const customFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
          attempt++;
          const urlStr = typeof input === "string" ? input : (input instanceof URL ? input.href : (input as Request).url);
          
          if (attempt === 1) {
            send("log", { type: "info", msg: `→ GET ${urlStr}` });
            send("log", { type: "info", msg: `  No payment header — server will return 402...` });
          } else {
            send("log", { type: "system", msg: `→ GET ${urlStr}` });
            send("log", { type: "system", msg: `  Retrying with X-Payment header...` });
          }

          const res = await fetch(input, init);

          if (attempt === 1 && res.status === 402) {
            send("log", { type: "info", msg: `← 402 Payment Required` });
            send("log", { type: "system", msg: `  Building Soroban payment transaction...` });
            send("log", { type: "system", msg: `  Price: ${api.priceUsdc} USDC` });
            send("log", { type: "system", msg: `  Signing with agent wallet...` });
          }

          return res;
        };

        const fetchWithX402 = wrapFetchWithPayment(customFetch, client);

        send("log", { type: "info", msg: `Calling ${targetUrl}` });
        const res = await fetchWithX402(targetUrl, { method: "GET" });

        if (res.ok) {
          const txHash = res.headers.get("x-paygate-txhash") ?? "";
          const resNetwork = res.headers.get("x-paygate-network") ?? "";
          send("log", { type: "success", msg: `← 200 OK — payment settled!` });
          if (txHash) send("log", { type: "success", msg: `  Tx Hash: ${txHash}` });
          if (resNetwork) send("log", { type: "success", msg: `  Network: ${resNetwork}` });
          const data: unknown = await res.json();
          send("result", { data, txHash, network: resNetwork });
        } else {
          const body = await res.text().catch(() => "");
          send("log", { type: "error", msg: `← ${res.status}: ${body.slice(0, 200)}` });
          send("error", { message: `Request failed with status ${res.status}` });
        }
      } catch (err: any) {
        send("log", { type: "error", msg: `Failed: ${err.message}` });
        send("error", { message: err.message });
      } finally {
        send("done", {});
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
