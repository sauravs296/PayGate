#![cfg(test)]
use super::*;
use soroban_sdk::testutils::Address as _;

// ─── Helpers ──────────────────────────────────────────────────────────────────

fn setup() -> (Env, ReceiptVerifierClient<'static>) {
    let env = Env::default();
    env.mock_all_auths(); // mock Stellar auth for all calls in this environment
    let contract_id = env.register(ReceiptVerifier, ());
    let client = ReceiptVerifierClient::new(&env, &contract_id);
    // SAFETY: the client borrows `env` but we return both; caller must keep `env` alive.
    let client: ReceiptVerifierClient<'static> = unsafe { core::mem::transmute(client) };
    (env, client)
}

// ─── Test Cases ───────────────────────────────────────────────────────────────

#[test]
fn records_and_verifies_a_receipt() {
    let (env, client) = setup();
    let caller = Address::generate(&env);
    let admin = Address::generate(&env);
    let api_id = String::from_str(&env, "cricket-predictor");

    let ts = client.record_receipt(&admin, &caller, &api_id, &2_000_000i128); // $0.002 USDC
    assert!(client.has_receipt(&caller, &api_id, &ts));
}

#[test]
#[should_panic(expected = "duplicate receipt")]
fn rejects_duplicate_receipt_in_same_ledger() {
    let (env, client) = setup();
    let caller = Address::generate(&env);
    let admin = Address::generate(&env);
    let api_id = String::from_str(&env, "cricket-predictor");

    client.record_receipt(&admin, &caller, &api_id, &2_000_000i128);
    // Second call with identical (caller, api_id, timestamp) must panic
    client.record_receipt(&admin, &caller, &api_id, &2_000_000i128);
}

#[test]
fn has_receipt_returns_false_for_unknown_call() {
    let (env, client) = setup();
    let caller = Address::generate(&env);
    let api_id = String::from_str(&env, "unknown-api");

    assert!(!client.has_receipt(&caller, &api_id, &0u64));
}

#[test]
#[should_panic]
fn rejects_receipt_without_caller_authorization() {
    // No mock_all_auths() — auth is NOT mocked, so require_auth() will panic
    let env = Env::default();
    let contract_id = env.register(ReceiptVerifier, ());
    let client = ReceiptVerifierClient::new(&env, &contract_id);

    let caller = Address::generate(&env);
    let admin = Address::generate(&env);
    let api_id = String::from_str(&env, "cricket-predictor");

    // Should panic: admin has not authorised this invocation
    client.record_receipt(&admin, &caller, &api_id, &2_000_000i128);
}
