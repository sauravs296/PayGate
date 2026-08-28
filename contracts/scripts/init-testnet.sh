#!/usr/bin/env bash
set -e

# Change to the root of the project (if run from contracts/scripts)
cd "$(dirname "$0")/../.."

echo "Sourcing .env.local variables..."
set -a
source apps/web/.env.local
set +a

echo "Initializing paygate-router..."
stellar contract invoke \
  --id $PAYGATE_ROUTER_CONTRACT_ID \
  --source deployer \
  --network testnet \
  -- \
  init \
  --admin $PAYGATE_TREASURY_WALLET \
  --token $SOROBAN_USDC_CONTRACT || echo "Router might already be initialized."

echo "Initializing paygate-reputation..."
stellar contract invoke \
  --id $PAYGATE_REPUTATION_CONTRACT_ID \
  --source deployer \
  --network testnet \
  -- \
  init \
  --admin $PAYGATE_TREASURY_WALLET \
  --token $SOROBAN_USDC_CONTRACT || echo "Reputation might already be initialized."

echo "✅ Contracts initialized successfully!"
