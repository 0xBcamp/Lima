pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.0/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.0/contracts/token/ERC20/utils/SafeERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.0/contracts/access/Ownable.sol";

contract TokenomicsAndIncentives is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public token;
    mapping(address => bool) public whitelist;
    mapping(address => uint256) public rewards;

    event RewardAdded(address indexed recipient, uint256 amount);
    event RewardClaimed(address indexed recipient, uint256 amount);

    constructor(address _token) {
        token = IERC20(_token);
    }

    function addToWhitelist(address[] calldata recipients) external onlyOwner {
        for (uint256 i = 0; i < recipients.length; i++) {
            whitelist[recipients[i]] = true;
        }
    }

    function removeFromWhitelist(address[] calldata recipients) external onlyOwner {
        for (uint256 i = 0; i < recipients.length; i++) {
            whitelist[recipients[i]] = false;
        }
    }

    function addReward(address recipient, uint256 amount) external onlyOwner {
        require(whitelist[recipient], "Recipient not whitelisted");
        rewards[recipient] += amount;
        token.safeTransferFrom(msg.sender, address(this), amount);
        emit RewardAdded(recipient, amount);
    }

    function claimReward() external {
        uint256 amount = rewards[msg.sender];
        require(amount > 0, "No rewards to claim");
        rewards[msg.sender] = 0;
        token.safeTransfer(msg.sender, amount);
        emit RewardClaimed(msg.sender, amount);
    }
}
