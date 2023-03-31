pragma solidity ^0.8.0;

interface IRewards {
    function addUserPoints(address user, uint256 points) external;
}