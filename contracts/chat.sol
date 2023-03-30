pragma solidity ^0.8.0;

contract P2PCommunication {
    mapping(address => mapping(address => uint)) public messages;

    event NewMessage(address indexed sender, address indexed recipient, uint timestamp, string message);

    function sendMessage(address recipient, string memory message) public {
        messages[msg.sender][recipient] += 1;
        emit NewMessage(msg.sender, recipient, block.timestamp, message);
    }

    function getMessageCount(address sender, address recipient) public view returns (uint) {
        return messages[sender][recipient];
    }
}
