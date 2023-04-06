// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Rewards is Ownable {
    // This mapping stores the points earned by a user in a specific month.
    mapping(address => mapping(uint256 => uint256)) public userMonthPoints;

    // This mapping stores the total points earned by all users in a specific month.
    mapping(uint256 => uint256) public totalMonthPoints;

    // This mapping stores the total rewards (in USDC) allocated for a specific month.
    mapping(uint256 => uint256) public totalMonthRewards;

    // This mapping keeps track of whether a user has withdrawn their rewards for a specific month.
    mapping(address => mapping(uint256 => bool)) public userRewardsWithdrawn;

    address public usdcTokenAddress;

    event UserPointsAdded(address indexed user, uint256 points, uint256 month);
    event RewardWithdrawn(address indexed user, uint256 amount, uint256 month);

    // This modifier checks if the given month is completed.
    // It ensures that users can only withdraw rewards from a completed month.
    modifier onlyCompletedMonth(uint256 month) {
        require(month < block.timestamp / 30 days, "Can only withdraw rewards from a completed month");
        _;
    }

    // This modifier checks if the user has not withdrawn their rewards for the given month.
    // It ensures that users cannot withdraw their rewards more than once for the same month.
    modifier notWithdrawn(uint256 month) {
        require(!userRewardsWithdrawn[msg.sender][month], "Rewards already withdrawn for this month");
        _;
    }

    constructor(address _usdcTokenAddress)  {
        usdcTokenAddress = _usdcTokenAddress;
    }

    // This function adds points to a user for the current month.
    function addUserPoints(address user, uint256 points) external {
        // Calculate the current month based on the block timestamp.
        uint256 currentMonth = block.timestamp / 30 days;

        // Add the given points to the user's points for the current month.
        userMonthPoints[user][currentMonth] += points;

        // Add the given points to the total points for the current month.
        totalMonthPoints[currentMonth] += points;

        // Emit an event
        emit UserPointsAdded(user, points, currentMonth);
    }

    // This function allows users to withdraw their rewards for a specified month based on a rolling 3-month rewards calculation.
    function withdrawUserRewards(uint256 month) external onlyCompletedMonth(month) notWithdrawn(month) {
        // Calculate the start month for the rolling 3-month rewards calculation.
        uint256 startMonth = (month >= 2) ? (month - 2) : 0;

        // Initialize variables for tracking variables (Used to calculate rewards)
        uint256 totalPoints = 0;
        uint256 totalRewards = 0;
        uint256 userPoints = 0;

        // Iterate through the 3-month period (from startMonth to the specified month, inclusive).
        // Adding the totals to tracking variables
        for (uint256 i = startMonth; i <= month; i++) {
            totalPoints += totalMonthPoints[i];
            totalRewards += totalMonthRewards[i];
            userPoints += userMonthPoints[msg.sender][i];
        }

        // Ensure the user has points within the rolling 3-month period.
        require(userPoints > 0, "No rewards to withdraw");

        // Calculate the user's reward based on their points and the total points in the 3-month period.
        uint256 userReward = (totalRewards * userPoints) / totalPoints;

        // Mark the user's rewards as withdrawn for the specified month.
        userRewardsWithdrawn[msg.sender][month] = true;

        // Transfer the calculated reward amount from the contract's address to the user's address.
        IERC20 usdcToken = IERC20(usdcTokenAddress); 
        usdcToken.transferFrom(address(this), msg.sender, userReward);

        // Emit an event
        emit RewardWithdrawn(msg.sender, userReward, month);
    }

    // This function adds rewards to the contract for the current month.
    function addRewards() public payable {
        // Calculate the current month based on the block timestamp.
        uint256 currentMonth = block.timestamp / 30 days;

        // Add the received ether (in wei) to the total rewards for the current month.
        totalMonthRewards[currentMonth] += msg.value;
    }

    // It calls the addRewards function to ensure the received ether is added to the rewards pool.
    receive() external payable {
        addRewards();
    }

    // It calls the addRewards function to ensure the received ether is added to the rewards pool.
    fallback() external payable {
        addRewards();
    }
}