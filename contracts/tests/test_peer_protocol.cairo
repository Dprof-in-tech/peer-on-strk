use starknet::{ContractAddress, get_contract_address};
use snforge_std::{declare, ContractClassTrait, DeclareResultTrait, DeclareResult, 
    start_cheat_caller_address, stop_cheat_caller_address,
    spy_events, EventSpyAssertionsTrait
};

use peer_protocol::interfaces::ipeer_protocol::{IPeerProtocolDispatcher, IPeerProtocolDispatcherTrait};
use peer_protocol::peer_protocol::PeerProtocol;

use peer_protocol::interfaces::ierc20::{IERC20Dispatcher, IERC20DispatcherTrait};

const ONE_E18: u256 = 1000000000000000000_u256;

fn deploy_token(name: ByteArray) -> ContractAddress {
    let contract = declare(name).unwrap().contract_class();
    
    let (contract_address, _) = contract.deploy(@ArrayTrait::new()).unwrap();

    contract_address
}

fn deploy_peer_protocol() -> ContractAddress {
    let owner: ContractAddress = starknet::contract_address_const::<0x123626789>();

    let mut constructor_calldata = ArrayTrait::new();
    constructor_calldata.append(owner.into());

    let contract = declare("PeerProtocol").unwrap().contract_class();
    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();

    contract_address
}

#[test]
#[should_panic(expected: "token not supported")]
fn test_deposit_should_panic_for_unsupported_token() {
    let token_address = deploy_token("MockToken");
    let peer_protocol_address = deploy_peer_protocol();

    let token = IERC20Dispatcher {contract_address: token_address};
    let caller: ContractAddress = starknet::contract_address_const::<0x122226789>();
    let mint_amount: u256 = 1000 *  ONE_E18;

    let peer_protocol = IPeerProtocolDispatcher {contract_address: peer_protocol_address};

    token.mint(caller, mint_amount);

    // Approving peer_protocol contract to spend mock_token
    start_cheat_caller_address(token_address, caller);
    token.approve(peer_protocol_address, mint_amount);
    stop_cheat_caller_address(token_address);

    // Prank caller to deposit into peer protocol
    start_cheat_caller_address(peer_protocol_address, caller);
    let deposit_amount: u256 = 100 * ONE_E18;
    peer_protocol.deposit(token_address, deposit_amount);
    stop_cheat_caller_address(peer_protocol_address);
}

#[test]
fn test_deposit() {
    let token_address = deploy_token("MockToken");
    let peer_protocol_address = deploy_peer_protocol();

    let token = IERC20Dispatcher {contract_address: token_address};
    let caller: ContractAddress = starknet::contract_address_const::<0x122226789>();
    let mint_amount: u256 = 1000 *  ONE_E18;

    let peer_protocol = IPeerProtocolDispatcher {contract_address: peer_protocol_address};

    let owner: ContractAddress = starknet::contract_address_const::<0x123626789>();

    // Prank owner to add supported token in peer protocol
    start_cheat_caller_address(peer_protocol_address, owner);
    peer_protocol.add_supported_token(token_address);
    stop_cheat_caller_address(peer_protocol_address);

    token.mint(caller, mint_amount);

    // Approving peer_protocol contract to spend mock_token
    start_cheat_caller_address(token_address, caller);
    token.approve(peer_protocol_address, mint_amount);
    stop_cheat_caller_address(token_address);

    // Prank caller to deposit into peer protocol
    start_cheat_caller_address(peer_protocol_address, caller);
    let deposit_amount: u256 = 100 * ONE_E18;
    let mut spy = spy_events();
    
    peer_protocol.deposit(token_address, deposit_amount);

    // testing peer_protocol contract balance increase
    assert!(token.balance_of(peer_protocol_address) == deposit_amount , "deposit failed");

    // testing emitted event
    let expected_event = PeerProtocol::Event::DepositSuccessful(PeerProtocol::DepositSuccessful { user: caller, token: token_address, amount: deposit_amount });

    spy.assert_emitted(@array![(peer_protocol_address, expected_event)]);

    stop_cheat_caller_address(peer_protocol_address);
}
