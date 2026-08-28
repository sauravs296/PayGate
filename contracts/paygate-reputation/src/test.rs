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
fn test_reputation() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, PayGateReputation);
    let client = PayGateReputationClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let developer = Address::generate(&env);
    let caller = Address::generate(&env);
    
    // Setup token
    let token_admin = Address::generate(&env);
    let (token, token_admin_client) = create_token_contract(&env, &token_admin);
    
    // Mint tokens to developer
    token_admin_client.mint(&developer, &100000000);
    assert_eq!(token.balance(&developer), 100000000);

    // Init reputation
    client.init(&admin, &token.address);

    let api_id = String::from_str(&env, "demo-ai");
    let stake_amount = 50000000;

    // Developer stakes (mock_all_auths handles the approval implicitly for tests, 
    // but in reality developer would call token.approve() first).
    client.stake_api(&developer, &api_id, &stake_amount);

    // Check balances
    assert_eq!(token.balance(&developer), 50000000);
    assert_eq!(token.balance(&contract_id), 50000000);

    // Vote
    client.vote(&caller, &api_id, &true);
    
    // Unstake
    client.unstake_api(&api_id);
    
    assert_eq!(token.balance(&developer), 100000000);
    assert_eq!(token.balance(&contract_id), 0);
}
