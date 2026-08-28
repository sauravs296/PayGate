#!/usr/bin/env bash
# Build all Soroban contracts to WASM.
# Run from the repo root: ./contracts/scripts/build.sh
set -e

cd "$(dirname "$0")/.."

echo "Building workspace..."
stellar contract build

echo "Done."
echo "WASM artifacts are in: contracts/target/wasm32-unknown-unknown/release/"
