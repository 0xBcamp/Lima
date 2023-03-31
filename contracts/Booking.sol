pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./User.sol";
import "./Property.sol";
import "./Escrow.sol";

contract Booking is ERC721 {
    using Counters for Counters.Counter;

    struct BookingInfo {
        uint256 propertyId;
        address renter;
        uint256 startDate;
        uint256 endDate;
    }

    uint256 private bookingCounter;
    mapping(uint256 => BookingInfo) private _bookings;
    Counters.Counter private _bookingIds;
    mapping(uint256 => uint256) public bookingIdToPropertyId;

    User userContract;
    Property propertyContract;
    Escrow escrowContract;
    address public usdcTokenAddress;

    modifier onlyRegisteredUser() {
        //Checking the user contract to verify that the current user is registered
        // require(userContract.isUserRegistered(msg.sender), "User is not registered");
        _;
    }


    constructor(address _userContractAddress, address _propertyContractAddress, address _escrowContractAddress, address _usdcTokenAddress) ERC721("BookingToken", "BKG") {
        userContract = User(_userContractAddress);
        propertyContract = Property(_propertyContractAddress);
        escrowContract = Escrow(_escrowContractAddress);
        usdcTokenAddress = _usdcTokenAddress;
    }

    function createBooking(uint256 _propertyId, uint256 _startDate, uint256 _endDate) public payable onlyRegisteredUser {
        require(_startDate < _endDate, "Start date must be before end date");
        require(propertyContract.isPropertyAvailable(_propertyId, _startDate, _endDate), "Property is not available for the given dates");

        // Generate a unique booking ID
        _bookingIds.increment();
        uint256 bookingId = _bookingIds.current();

        // Create the booking
        _bookings[bookingId] = BookingInfo(_propertyId, msg.sender, _startDate, _endDate);

        // Store the propertyId for this bookingId
        bookingIdToPropertyId[bookingId] = _propertyId;

        // Update the property's availability in the PropertyContract
        propertyContract.updateAvailability(_propertyId, _startDate, _endDate);

        // Calculate required payment amount
        uint256 totalPrice = propertyContract.getTotalPriceForDates(_propertyId, _startDate, _endDate);

        // Deposit the funds into the escrow contract
        escrowContract.deposit(bookingId, totalPrice);

        // Transfer USDC from the user to the escrow contract
        IERC20 usdcToken = IERC20(usdcTokenAddress); 
        usdcToken.transferFrom(msg.sender, address(escrowContract), totalPrice);

        // Emit a booking event
        emit BookingCreated(bookingId, _propertyId, msg.sender, _startDate, _endDate);

        //Sending the reuired USDC from the msg.sender to the Escrow account
    }

    function getPropertyIdByBookingId(uint256 _bookingId) public view returns (uint256) {
        return bookingIdToPropertyId[_bookingId];
    }

    function isBookingCompleted(address user, uint256 propertyId, uint256 bookingId) public view returns (bool) {
        // Check if the given bookingId exists and is associated with the propertyId
        if (bookingIdToPropertyId[bookingId] != propertyId) {
            return false;
        }

        // Check if the user is the renter in the booking
        BookingInfo memory booking = _bookings[bookingId];
        if (booking.renter != user) {
            return false;
        }

        // Check if the booking endDate is in the past
        if (booking.endDate < block.timestamp) {
            return true;
        }

        return false;
    }

    event BookingCreated(uint256 indexed bookingId, uint256 indexed propertyId, address indexed renter, uint256 startDate, uint256 endDate);
}