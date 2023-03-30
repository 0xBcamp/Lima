pragma solidity ^0.8.0;

contract IdentityContract {
    struct User {
        string name;
        bool verified;
        uint256[] ratings;
    }

    mapping (address => User) public users;

    function register(string memory name) public {
        users[msg.sender] = User(name, false, new uint256[](0));
    }

    function verify() public {
        require(!users[msg.sender].verified, "User already verified");
        users[msg.sender].verified = true;
    }

    function rate(address user, uint256 rating) public {
        require(users[user].verified, "User not verified");
        users[user].ratings.push(rating);
    }

    function getAverageRating(address user) public view returns (uint256) {
        uint256[] memory ratings = users[user].ratings;
        uint256 sum = 0;
        for (uint256 i = 0; i < ratings.length; i++) {
            sum += ratings[i];
        }
        return sum / ratings.length;
    }
}
