// @paygate/sdk
//
// Shared x402 client logic and resilient Stellar Horizon network helpers.

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffFactor?: number;
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 8000,
  backoffFactor: 2,
};

/**
 * Checks if an error from Horizon/fetch is a transient network or timeout error.
 */
export function isTransientHorizonError(error: unknown): boolean {
  if (!error) return false;
  const msg = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  
  return (
    msg.includes("timeout") ||
    msg.includes("timed out") ||
    msg.includes("econnreset") ||
    msg.includes("econnrefused") ||
    msg.includes("etimedout") ||
    msg.includes("network error") ||
    msg.includes("504") ||
    msg.includes("502") ||
    msg.includes("503") ||
    msg.includes("gateway timeout")
  );
}

/**
 * Executes a Horizon network operation with exponential backoff and retry.
 * Prevents AI agent crashes during 402 negotiation when Horizon nodes experience latency.
 */
export async function withHorizonRetry<T>(
  operation: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let delay = opts.initialDelayMs;
  let attempt = 0;

  while (true) {
    attempt++;
    try {
      return await operation();
    } catch (err) {
      if (attempt > opts.maxRetries || !isTransientHorizonError(err)) {
        throw err;
      }

      console.warn(
        `[PayGate SDK] Horizon operation failed (attempt ${attempt}/${opts.maxRetries}), retrying in ${delay}ms...`,
        err instanceof Error ? err.message : err
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * opts.backoffFactor, opts.maxDelayMs);
    }
  }
}
