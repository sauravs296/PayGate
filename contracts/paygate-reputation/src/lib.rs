#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, String, Symbol,
};
use soroban_sdk::token::Client as TokenClient;

/// Tracks a developer's API stake
#[contracttype]
#[derive(Clone)]
pub struct ApiStake {
    pub developer: Address,
    pub amount: i128,
    pub upvotes: u32,
    pub downvotes: u32,
}

const STAKE_PREFIX: Symbol = symbol_short!("stake");
const ADMIN: Symbol = symbol_short!("admin");
const TOKEN: Symbol = symbol_short!("token");

#[contract]
pub struct PayGateReputation;

#[contractimpl]
impl PayGateReputation {
    pub fn init(env: Env, admin: Address, token: Address) {
        if env.storage().instance().has(&ADMIN) {
            panic!("already initialized");
        }
        env.storage().instance().set(&ADMIN, &admin);
        env.storage().instance().set(&TOKEN, &token);
    }

    /// Developer stakes tokens to register their API.
    /// Uses `transfer_from`, so the developer must first `approve` this contract.
    pub fn stake_api(env: Env, developer: Address, api_id: String, amount: i128) {
        developer.require_auth();

        if amount < 10000000 {
            // e.g. min 1 USDC
            panic!("minimum stake is 1 USDC");
        }

        let key = (STAKE_PREFIX, api_id.clone());
        if env.storage().persistent().has(&key) {
            panic!("API already staked");
        }

        let token_address: Address = env.storage().instance().get(&TOKEN).unwrap();
        let token_client = TokenClient::new(&env, &token_address);

        // Contract addresses can't transfer directly unless they are the owner,
        // so we use transfer_from to pull the funds from the developer to the contract.
        token_client.transfer(&developer, &env.current_contract_address(), &amount);

        let stake = ApiStake {
            developer: developer.clone(),
            amount,
            upvotes: 0,
            downvotes: 0,
        };
        env.storage().persistent().set(&key, &stake);
        
        let topics = (symbol_short!("staked"), developer, api_id);
        env.events().publish(topics, amount);
    }

    /// Caller votes on an API. We record this (cost is gas only).
    pub fn vote(env: Env, caller: Address, api_id: String, upvote: bool) {
        caller.require_auth();
        
        let key = (STAKE_PREFIX, api_id.clone());
        let mut stake: ApiStake = env.storage().persistent().get(&key).expect("API not staked");

        if upvote {
            stake.upvotes += 1;
        } else {
            stake.downvotes += 1;
        }

        env.storage().persistent().set(&key, &stake);
        
        let topics = (symbol_short!("voted"), caller, api_id);
        env.events().publish(topics, upvote);
    }
    
    /// Unstake and return funds to developer.
    /// In a production scenario, this might have a 7-day cooldown.
    pub fn unstake_api(env: Env, api_id: String) {
        let key = (STAKE_PREFIX, api_id.clone());
        let stake: ApiStake = env.storage().persistent().get(&key).expect("API not staked");
        
        stake.developer.require_auth();
        
        let token_address: Address = env.storage().instance().get(&TOKEN).unwrap();
        let token_client = TokenClient::new(&env, &token_address);
        
        // Return funds
        token_client.transfer(&env.current_contract_address(), &stake.developer, &stake.amount);
        
        // Remove stake
        env.storage().persistent().remove(&key);
        
        let topics = (symbol_short!("unstaked"), stake.developer, api_id);
        env.events().publish(topics, stake.amount);
    }
}

mod test;
