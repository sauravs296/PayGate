#![no_std]
//! Route Soroban token payments between an API developer and a protocol wallet.
//!
//! # Workflow
//!
//! 1. Call [`PayGateRouter::init`] once to store the administrator and protocol
//!    wallet. Initialization does not require authorization, so arrange for the
//!    intended initialization to occur before other callers can initialize it.
//! 2. The administrator calls [`PayGateRouter::set_route`] to create or replace
//!    each API's [`RouteConfig`]. The developer's share is configurable in basis
//!    points; `9000` means 90%, rather than a fixed split enforced by the router.
//! 3. An authorized payer calls [`PayGateRouter::pay`]. Positive shares are
//!    transferred directly from the payer to each recipient, then a payment
//!    event is published for indexers.
//!
//! # Amounts and failures
//!
//! Amounts use the selected token's integer base units; the router does not
//! convert decimal amounts. For positive payments, division rounds the developer
//! share down and leaves the remainder with the protocol. For example, `101`
//! base units at `9000` basis points gives `90` to the developer and `11` to the
//! protocol. See [`PayGateRouter::pay`] for non-positive amounts and event data.
//!
//! The contract defines no custom error enum. Calls can fail through the panics
//! documented below, Soroban authorization or storage failures, arithmetic
//! overflow, or failures in the selected token contract.

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, String, Symbol,
};
use soroban_sdk::token::Client as TokenClient;

/// Payment recipients and split for one API identifier.
///
/// [`PayGateRouter::set_route`] stores this configuration in persistent storage
/// under `("route", api_id)`, replacing any previous entry for the same API.
/// The protocol recipient is stored separately by [`PayGateRouter::init`].
#[contracttype]
#[derive(Clone)]
pub struct RouteConfig {
    /// Recipient of the developer's share of each payment.
    pub developer: Address,
    /// Developer's share in basis points, validated as `0..=10000` by
    /// [`PayGateRouter::set_route`]. `0` allocates everything to the protocol;
    /// `10000` allocates everything to the developer. `9000` represents 90%.
    pub share_bps: u32, // e.g., 9000 = 90% to developer
}

const ROUTE_PREFIX: Symbol = symbol_short!("route");
const PROTOCOL_FEE_WALLET: Symbol = symbol_short!("prot_fee");
const ADMIN: Symbol = symbol_short!("admin");

#[contract]
/// Soroban contract that manages API routes and splits authorized payments.
///
/// Use [`PayGateRouter::init`] before [`PayGateRouter::set_route`], then [`PayGateRouter::pay`] for each
/// payment. The administrator and protocol wallet live in instance storage;
/// individual API routes live in persistent storage.
pub struct PayGateRouter;

#[contractimpl]
impl PayGateRouter {
    /// Store the administrator and protocol fee wallet once.
    ///
    /// # Arguments
    ///
    /// * `env` - Soroban execution environment for this contract.
    /// * `admin` - Address whose authorization is required by [`PayGateRouter::set_route`].
    /// * `protocol_fee_wallet` - Recipient of the remainder after the developer's
    ///   share is calculated by [`PayGateRouter::pay`].
    ///
    /// # Authorization and storage
    ///
    /// This function does **not** call `require_auth`, including on `admin`.
    /// The first successful caller chooses both addresses. They are stored in
    /// instance storage under `"admin"` and `"prot_fee"`; there is no public
    /// method to change them after initialization. No event is emitted.
    ///
    /// # Panics
    ///
    /// Panics with `"already initialized"` if the admin storage entry exists.
    pub fn init(env: Env, admin: Address, protocol_fee_wallet: Address) {
        if env.storage().instance().has(&ADMIN) {
            panic!("already initialized");
        }
        env.storage().instance().set(&ADMIN, &admin);
        env.storage().instance().set(&PROTOCOL_FEE_WALLET, &protocol_fee_wallet);
    }

    /// Create or overwrite the payment route for an API, with admin authorization.
    ///
    /// # Arguments
    ///
    /// * `env` - Soroban execution environment for this contract.
    /// * `api_id` - Exact API identifier used to look up the route in [`PayGateRouter::pay`].
    ///   The router performs no normalization or nonempty-string validation.
    /// * `developer` - Recipient of the developer share.
    /// * `share_bps` - Developer share in basis points, from `0` to `10000`
    ///   inclusive. For example, `9000` assigns 90% before integer rounding.
    ///
    /// The stored administrator must authorize this invocation. The route is
    /// written to persistent storage under `("route", api_id)`, replacing any
    /// existing developer and split. No developer authorization is required,
    /// and no event is emitted.
    ///
    /// # Panics and failures
    ///
    /// Panics when the admin entry is absent (the storage lookup is unwrapped),
    /// so call [`PayGateRouter::init`] first. Authorization failure aborts the invocation.
    /// After authorization, values above `10000` panic with
    /// `"share_bps cannot exceed 10000"`.
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

    /// Split an authorized caller's payment using the API's current route.
    ///
    /// # Arguments
    ///
    /// * `env` - Soroban execution environment for this contract.
    /// * `caller` - Payer whose authorization is required and whose token balance
    ///   supplies both transfers.
    /// * `token` - Address of the token contract used for transfers. The router
    ///   does not maintain a token allowlist or validate this address in advance.
    /// * `api_id` - Exact identifier of a route configured by [`PayGateRouter::set_route`].
    /// * `amount` - Signed integer amount in the token's base units, with no
    ///   decimal conversion or positivity check by the router.
    ///
    /// # Split and transfers
    ///
    /// The developer share is `(amount * share_bps) / 10000`, using `i128`
    /// arithmetic and division that truncates toward zero. The protocol share
    /// is `amount - developer_share`. For positive amounts, any rounding
    /// remainder therefore goes to the protocol wallet. Each share is transferred
    /// directly from `caller` only if it is greater than zero, developer first.
    /// The router does not hold the payment between transfers.
    ///
    /// A zero amount skips both transfers. With a valid split, a negative amount
    /// also skips both transfers if the multiplication does not overflow. These
    /// calls still require caller authorization and valid stored configuration,
    /// and still publish an event on success. An event alone therefore does not
    /// establish that a positive token transfer occurred.
    ///
    /// # Event
    ///
    /// After the transfers succeed (or are skipped), publishes one event with
    /// topics `("pay", caller, api_id)` and data
    /// `(token, amount, developer_share, protocol_share)`. `"pay"` is a Soroban
    /// symbol, `api_id` is a Soroban string, and all three amounts are `i128`
    /// base-unit values. The event does not include the recipients' addresses.
    ///
    /// # Panics and failures
    ///
    /// Caller authorization is checked first. A missing route then panics with
    /// `"route not configured"`. A missing protocol wallet also panics because
    /// its storage lookup is unwrapped. The intermediate multiplication can
    /// overflow `i128`, even when the final divided result would fit; the
    /// workspace's release profiles enable overflow checks.
    ///
    /// Token calls can fail, for example due to insufficient funds, authorization
    /// failure, or an invalid token contract. These failures abort the invocation;
    /// Soroban rolls back its changes, including an earlier developer transfer
    /// if the protocol transfer fails. This method returns no receipt value and
    /// defines no custom error codes.
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
