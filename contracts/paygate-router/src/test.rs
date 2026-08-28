#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};
use soroban_sdk::token::{Client as TokenClient, StellarAssetClient as TokenAdminClient};

fn create_token_contract<'a>(e: &Env, admin: &Address) -> (TokenClient<'a>, TokenAdminClient<'a>) {
    let token_address = e.register_stellar_asset_contract(admin.clone());
    let token = TokenClient::new(e, &token_address);
    let token_admin = TokenAdminClient::new(e, &token_address);
    (token, token_admin)
}

#[test]
fn test_router() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, PayGateRouter);
    let client = PayGateRouterClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let protocol_fee_wallet = Address::generate(&env);
    let developer = Address::generate(&env);
    let caller = Address::generate(&env);
    
    // Setup token
    let token_admin = Address::generate(&env);
    let (token, token_admin_client) = create_token_contract(&env, &token_admin);
    
    // Mint tokens to caller
    token_admin_client.mint(&caller, &1000000);
    assert_eq!(token.balance(&caller), 1000000);

    // Init router
    client.init(&admin, &protocol_fee_wallet);

    // Set route
    let api_id = String::from_str(&env, "demo-weather");
    client.set_route(&api_id, &developer, &9000); // 90%

    // Make payment (10 USDC = 100_000_000 stroops, let's just do 10_000)
    let payment_amount = 10000;
    
    // Perform payment
    client.pay(&caller, &token.address, &api_id, &payment_amount);

    // Check balances
    // Caller should have 1,000,000 - 10,000 = 990,000
    assert_eq!(token.balance(&caller), 990000);
    // Developer should have 90% of 10,000 = 9,000
    assert_eq!(token.balance(&developer), 9000);
    // Protocol fee wallet should have 10% of 10,000 = 1,000
    assert_eq!(token.balance(&protocol_fee_wallet), 1000);
}
