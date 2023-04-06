// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DummyUSDC is ERC20 {
    constructor() ERC20("Dummy USDC", "dUSDC") {
        _mint(msg.sender, 1000000 * 10**decimals()); // Mint an initial supply to the contract deployer
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}