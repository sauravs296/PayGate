"use client";

import { StellarWalletsKit, Networks } from "@creit.tech/stellar-wallets-kit";
import { defaultModules } from "@creit.tech/stellar-wallets-kit/modules/utils";

let isInitialized = false;

export function getWalletKit() {
  if (typeof window === "undefined") {
    // Return dummy for SSR
    return StellarWalletsKit;
  }

  if (!isInitialized) {
    StellarWalletsKit.init({
      network: Networks.TESTNET,
      modules: defaultModules(),
    });
    isInitialized = true;
  }

  return StellarWalletsKit;
}

