#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, String, Symbol,
};

/// On-chain receipt stored per (caller, api_id, timestamp) triple.
/// Used as an immutable audit log of every settled PayGate payment.
#[contracttype]
#[derive(Clone)]
pub struct Receipt {
    pub caller: Address,
    pub api_id: String,
    pub amount: i128, // amount in 7-decimal base units (e.g. 2_000_000 = $0.002 USDC)
    pub timestamp: u64,
}

const RECEIPT_KEY: Symbol = symbol_short!("receipt");

#[contract]
pub struct ReceiptVerifier;

#[contractimpl]
impl ReceiptVerifier {
    /// Record a payment receipt on-chain after a successful settlement.
    ///
    /// `admin` must authorise this invocation via `require_auth()` — this allows
    /// the PayGate backend to securely record receipts on behalf of users.
    ///
    /// Returns the ledger timestamp at which the receipt was recorded.
    /// Panics on a duplicate (same caller + api_id + timestamp).
    pub fn record_receipt(env: Env, admin: Address, caller: Address, api_id: String, amount: i128) -> u64 {
        admin.require_auth();

        let timestamp = env.ledger().timestamp();
        let key = (RECEIPT_KEY, caller.clone(), api_id.clone(), timestamp);

        if env.storage().persistent().has(&key) {
            panic!("duplicate receipt");
        }

        let receipt = Receipt {
            caller,
            api_id,
            amount,
            timestamp,
        };
        env.storage().persistent().set(&key, &receipt);
        timestamp
    }

    /// Read-only check: returns true if a receipt exists for the given
    /// (caller, api_id, timestamp) triple.
    ///
    /// Called by the Next.js backend to confirm a receipt is on-chain
    /// before trusting a client's claim that it paid.
    pub fn has_receipt(env: Env, caller: Address, api_id: String, timestamp: u64) -> bool {
        let key = (RECEIPT_KEY, caller, api_id, timestamp);
        env.storage().persistent().has(&key)
    }
}

mod test;
