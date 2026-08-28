import { rpc, scValToNative } from "@stellar/stellar-sdk";
import dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables
dotenv.config({ path: resolve(__dirname, "../.env.local") });

const REPUTATION_CONTRACT_ID = process.env.PAYGATE_REPUTATION_CONTRACT_ID;
const NETWORK = process.env.STELLAR_NETWORK === "pubnet" ? "stellar:pubnet" : "stellar:testnet";
const RPC_URL = NETWORK === "stellar:pubnet" ? "https://soroban-rpc.mainnet.stellar.gateway.fm" : "https://soroban-testnet.stellar.org";

const server = new rpc.Server(RPC_URL);

/**
 * A simple background indexer that polls the Soroban RPC for new events
 * from the PayGate reputation contract and processes them.
 */
async function runIndexer() {
  if (!REPUTATION_CONTRACT_ID) {
    console.error("PAYGATE_REPUTATION_CONTRACT_ID is not set");
    process.exit(1);
  }

  console.log(`Starting indexer for contract: ${REPUTATION_CONTRACT_ID} on ${NETWORK}`);

  // Fetch the latest ledger to start polling from
  const latestLedgerResponse = await server.getLatestLedger();
  let cursor = latestLedgerResponse.sequence;

  console.log(`Starting from ledger: ${cursor}`);

  while (true) {
    try {
      // Poll every 5 seconds
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const currentLedgerResponse = await server.getLatestLedger();
      const currentLedger = currentLedgerResponse.sequence;

      if (currentLedger <= cursor) {
        continue;
      }

      console.log(`Fetching events from ledger ${cursor} to ${currentLedger}`);

      const eventsResponse = await server.getEvents({
        startLedger: cursor,
        filters: [
          {
            type: "contract",
            contractIds: [REPUTATION_CONTRACT_ID],
            topics: [
              ["*", "*", "*"] // Match all topics for this contract
            ]
          }
        ]
      });

      for (const event of eventsResponse.events) {
        try {
          await processEvent(event);
        } catch (e) {
          console.error("Error processing event:", e);
        }
      }

      cursor = currentLedger;
    } catch (err) {
      console.error("Indexer error:", err);
      // Wait a bit before retrying on error
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }
}

async function processEvent(event: rpc.Api.EventResponse) {
  if (event.type !== "contract") return;
  
  const topic1 = event.topic[0];
  if (!topic1) return;

  const eventName = scValToNative(topic1).toString();

  switch (eventName) {
    case "staked": {
      // Topics: [Symbol("staked"), Address(developer), String(api_id)]
      const developer = scValToNative(event.topic[1]).toString();
      const apiSlug = scValToNative(event.topic[2]).toString();
      const amount = scValToNative(event.value); // i128
      
      console.log(`[Event] Staked: ${developer} staked ${amount} on ${apiSlug}`);
      
      // Update DB if needed
      // For now, our StakeToPublish UI handles the DB update synchronously when the tx succeeds.
      // In a robust system, we would rely on the indexer to do it.
      break;
    }
    
    case "voted": {
      // Topics: [Symbol("voted"), Address(caller), String(api_id)]
      const caller = scValToNative(event.topic[1]).toString();
      const apiSlug = scValToNative(event.topic[2]).toString();
      const upvote = scValToNative(event.value); // bool
      
      console.log(`[Event] Voted: ${caller} voted ${upvote ? "UP" : "DOWN"} on ${apiSlug}`);
      
      // In a real implementation, we would update an ApiVote table here.
      break;
    }
    
    case "unstaked": {
      const developer = scValToNative(event.topic[1]).toString();
      const apiSlug = scValToNative(event.topic[2]).toString();
      console.log(`[Event] Unstaked: ${developer} unstaked ${apiSlug}`);
      break;
    }
  }
}

runIndexer().catch(console.error);
