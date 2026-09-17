import { Horizon } from "@stellar/stellar-sdk";

export interface HorizonRetryConfig {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
}

const DEFAULT_CONFIG: Required<HorizonRetryConfig> = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 8000,
  backoffMultiplier: 2,
};

export function isRetryableHorizonError(err: unknown): boolean {
  if (!err) return false;
  const msg = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();

  return (
    msg.includes("timeout") ||
    msg.includes("timed out") ||
    msg.includes("econnreset") ||
    msg.includes("econnrefused") ||
    msg.includes("etimedout") ||
    msg.includes("504") ||
    msg.includes("502") ||
    msg.includes("503") ||
    msg.includes("network error")
  );
}

/**
 * Wraps a call to Horizon with automatic exponential backoff retry.
 */
export async function withHorizonRetry<T>(
  action: () => Promise<T>,
  config?: HorizonRetryConfig
): Promise<T> {
  const { maxRetries, initialDelayMs, maxDelayMs, backoffMultiplier } = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  let delay = initialDelayMs;
  let attempt = 0;

  while (true) {
    attempt++;
    try {
      return await action();
    } catch (error) {
      if (attempt > maxRetries || !isRetryableHorizonError(error)) {
        throw error;
      }

      console.warn(
        `[Horizon Retry] Request timed out or network error (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`
      );

      await new Promise((res) => setTimeout(res, delay));
      delay = Math.min(delay * backoffMultiplier, maxDelayMs);
    }
  }
}
