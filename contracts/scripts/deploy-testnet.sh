#!/usr/bin/env bash
# Deploy all contracts to Stellar TESTNET (free).
# Run AFTER build.sh has produced the WASM.
# Run from the repo root: ./contracts/scripts/deploy-testnet.sh
set -e

cd "$(dirname "$0")/.."

echo "Generating + funding testnet deployer identity via Friendbot..."
# --fund calls Friendbot automatically — free, testnet only
stellar keys generate deployer --network testnet --fund || echo "Key already exists"

echo "Deploying receipt-verifier..."
RECEIPT_VERIFIER_ID=$(stellar contract deploy \
  --wasm target/wasm32v1-none/release/receipt_verifier.wasm \
  --source deployer \
  --network testnet)

echo "Deploying paygate-router..."
PAYGATE_ROUTER_ID=$(stellar contract deploy \
  --wasm target/wasm32v1-none/release/paygate_router.wasm \
  --source deployer \
  --network testnet)

echo "Deploying paygate-reputation..."
PAYGATE_REPUTATION_ID=$(stellar contract deploy \
  --wasm target/wasm32v1-none/release/paygate_reputation.wasm \
  --source deployer \
  --network testnet)

echo "RECEIPT_VERIFIER_CONTRACT_ID=$RECEIPT_VERIFIER_ID" > .env.contracts.testnet
echo "PAYGATE_ROUTER_CONTRACT_ID=$PAYGATE_ROUTER_ID" >> .env.contracts.testnet
echo "PAYGATE_REPUTATION_CONTRACT_ID=$PAYGATE_REPUTATION_ID" >> .env.contracts.testnet

echo ""
echo "✅ Deployed. Contract IDs saved to contracts/.env.contracts.testnet"
echo ""
echo "Add to apps/web/.env.local:"
echo "  RECEIPT_VERIFIER_CONTRACT_ID=$RECEIPT_VERIFIER_ID"
echo "  PAYGATE_ROUTER_CONTRACT_ID=$PAYGATE_ROUTER_ID"
echo "  PAYGATE_REPUTATION_CONTRACT_ID=$PAYGATE_REPUTATION_ID"
