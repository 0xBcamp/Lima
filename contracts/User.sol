// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./interfaces/IRewards.sol";

contract User is ERC721 {
    using Counters for Counters.Counter;
    using Strings for uint256;

    IRewards public rewardsContract;

    event UserRegistered(
        address indexed owner,
        uint256 indexed tokenId,
        string firstName,
        string lastName
    );

    Counters.Counter private _tokenIds;
    mapping(address => uint256) private _users; //Address to tokenId

    constructor(address _rewardsContractAddress) ERC721("UserNFT", "UNFT") {
        rewardsContract = IRewards(_rewardsContractAddress);
    }

    function registerUser(string memory firstName, string memory lastName) public returns (uint256) {
        require(!userExists(msg.sender), "User is already registered");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        // Save the tokenId in the _users mapping
        _users[msg.sender] = newItemId;

        //mint user NFT
        _mint(msg.sender, newItemId);

        //Reward user points for creating a profile.
        rewardsContract.addUserPoints(msg.sender, UserPointType.UserRegistered);

        emit UserRegistered(msg.sender, newItemId, firstName, lastName);

        return newItemId;
    }

    // Check if msg.sender exists in the _users mapping
    function userExists(address user) public view returns (bool) {
        return _users[user] != 0;
    }
}
