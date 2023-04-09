// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../enums/UserPointType.sol";

interface IRewards {
    function addUserPoints(address user, UserPointType pointType) external;
}