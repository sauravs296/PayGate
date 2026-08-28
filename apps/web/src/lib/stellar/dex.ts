import { Asset, Horizon } from "@stellar/stellar-sdk";


/**
 * Gets the Horizon server instance for the given network.
 * Note: Horizon is different from RPC. Soroban uses RPC, DEX uses Horizon.
 */
function getHorizonServer(network: string) {
  const url = network === "stellar:pubnet" 
    ? "https://horizon.stellar.org" 
    : "https://horizon-testnet.stellar.org";
  return new Horizon.Server(url);
}

/**
 * Reads the Stellar DEX order book to find the current conversion rate
 * between a given asset and USDC.
 * 
 * @param assetCode The asset to sell (e.g., "XLM")
 * @param assetIssuer The issuer of the asset (null for native XLM)
 * @param usdcIssuer The issuer of the USDC asset on the network
 * @returns The amount of USDC you get for 1 unit of the selling asset
 */
export async function getUsdcRate(
  network: string,
  assetCode: string,
  assetIssuer: string | null,
  usdcIssuer: string
): Promise<number> {
  const server = getHorizonServer(network);
  
  const selling = assetCode === "XLM" 
    ? Asset.native() 
    : new Asset(assetCode, assetIssuer!);
    
  const buying = new Asset("USDC", usdcIssuer);

  try {
    const orderbook = await server.orderbook(selling, buying).call();
    
    if (orderbook.asks.length === 0) {
      throw new Error("No DEX liquidity for this pair");
    }

    // Return the best ask price (how much USDC per 1 unit of asset)
    // The price is represented as a string ratio or decimal.
    return parseFloat(orderbook.asks[0].price);
  } catch (err) {
    console.error("Failed to fetch DEX rate:", err);
    throw err;
  }
}

/**
 * Reads AMM liquidity pool data for a given asset pair.
 */
export async function getAmmPool(
  network: string,
  assetA: Asset,
  assetB: Asset
): Promise<Horizon.ServerApi.LiquidityPoolRecord | null> {
  const server = getHorizonServer(network);

  try {
    const pools = await server.liquidityPools()
      .forAssets(assetA, assetB)
      .call();

    if (pools.records.length > 0) {
      return pools.records[0];
    }
    return null;
  } catch (err) {
    console.error("Failed to fetch AMM pool:", err);
    return null;
  }
}

/**
 * Optional helper to manually build a PathPaymentStrictReceive operation
 * if the x402 client needs fallback pathing.
 * (x402/stellar supports path payments natively via Horizon path finding).
 */
export async function findBestPath(
  network: string,
  sourceAccountId: string,
  destinationAsset: Asset,
  destinationAmount: string
): Promise<Horizon.ServerApi.PaymentPathRecord[]> {
  const server = getHorizonServer(network);
  
  try {
    const paths = await server.strictReceivePaths(
      sourceAccountId,
      destinationAsset,
      destinationAmount
    ).call();
    
    return paths.records;
  } catch (err) {
    console.error("Failed to find payment paths:", err);
    throw err;
  }
}
