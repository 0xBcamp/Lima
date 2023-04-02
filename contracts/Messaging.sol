pragma solidity ^0.8.0;

import "./Booking.sol";
import "./Property.sol";

contract Messaging {
    // Struct to store information about a message.
    struct Message {
        address sender;
        string content;
        uint256 timestamp;
    }

    // Mapping to store messages by booking ID.
    mapping(uint256 => Message[]) private _bookingMessages;

    Booking public bookingContract;
    Property public propertyContract;

    // Event emitted when a message is sent.
    event MessageSent(uint256 indexed bookingId, address indexed sender, string content, uint256 timestamp);

    // Constructor to initialize contract references.
    constructor(address _bookingContractAddress, address _propertyContractAddress) {
        bookingContract = Booking(_bookingContractAddress);
        propertyContract = Property(_propertyContractAddress);
    }

    // Function to send a message related to a booking.
    function sendMessage(uint256 bookingId, string memory content) external {
        // Check if the sender is either the guest or the host.
        require(isSenderGuestOrHost(bookingId, msg.sender), "Sender must be either the guest or the host");

        // Create a new message struct with the given information.
        Message memory newMessage = Message({
            sender: msg.sender,
            content: content,
            timestamp: block.timestamp
        });

        // Add the message to the mapping.
        _bookingMessages[bookingId].push(newMessage);

        // Emit the MessageSent event.
        emit MessageSent(bookingId, msg.sender, content, block.timestamp);
    }

    // Function to retrieve all messages related to a booking.
    function getMessages(uint256 bookingId) external view returns (Message[] memory) {
        return _bookingMessages[bookingId];
    }

    // Helper function to check if the sender is the guest or the host.
    function isSenderGuestOrHost(uint256 bookingId, address sender) internal view returns (bool) {
        uint256 propertyId = bookingContract.getPropertyIdByBookingId(bookingId);
        address propertyOwner = propertyContract.getPropertyOwner(propertyId);
        address guest = bookingContract.getRenterByBookingId(bookingId);

        return (sender == propertyOwner || sender == guest);
    }
}