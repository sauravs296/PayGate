#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, String, Symbol,
};
use soroban_sdk::token::Client as TokenClient;

/// Configures the route for a specific API
#[contracttype]
#[derive(Clone)]
pub struct RouteConfig {
    pub developer: Address,
    pub share_bps: u32, // e.g., 9000 = 90% to developer
}

const ROUTE_PREFIX: Symbol = symbol_short!("route");
const PROTOCOL_FEE_WALLET: Symbol = symbol_short!("prot_fee");
const ADMIN: Symbol = symbol_short!("admin");

#[contract]
pub struct PayGateRouter;

#[contractimpl]
impl PayGateRouter {
    /// Initialize the contract with an admin and a protocol fee wallet
    pub fn init(env: Env, admin: Address, protocol_fee_wallet: Address) {
        if env.storage().instance().has(&ADMIN) {
            panic!("already initialized");
        }
        env.storage().instance().set(&ADMIN, &admin);
        env.storage().instance().set(&PROTOCOL_FEE_WALLET, &protocol_fee_wallet);
    }

    /// Admin can set the routing config for a specific API
    pub fn set_route(env: Env, api_id: String, developer: Address, share_bps: u32) {
        let admin: Address = env.storage().instance().get(&ADMIN).unwrap();
        admin.require_auth();
        
        if share_bps > 10000 {
            panic!("share_bps cannot exceed 10000");
        }
        
        let key = (ROUTE_PREFIX, api_id);
        let config = RouteConfig {
            developer,
            share_bps,
        };
        env.storage().persistent().set(&key, &config);
    }

    /// Process a payment for an API
    pub fn pay(env: Env, caller: Address, token: Address, api_id: String, amount: i128) {
        caller.require_auth();
        
        let key = (ROUTE_PREFIX, api_id.clone());
        let config: RouteConfig = env.storage().persistent().get(&key).expect("route not configured");
        let protocol_fee_wallet: Address = env.storage().instance().get(&PROTOCOL_FEE_WALLET).unwrap();
        
        // Calculate shares
        let developer_share = (amount * (config.share_bps as i128)) / 10000;
        let protocol_share = amount - developer_share;
        
        // Execute transfers using the token client
        let token_client = TokenClient::new(&env, &token);
        
        if developer_share > 0 {
            token_client.transfer(&caller, &config.developer, &developer_share);
        }
        if protocol_share > 0 {
            token_client.transfer(&caller, &protocol_fee_wallet, &protocol_share);
        }
        
        // Emit an event for indexers
        let topics = (symbol_short!("pay"), caller.clone(), api_id);
        env.events().publish(topics, (token, amount, developer_share, protocol_share));
    }
}

mod test;
