pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Property.sol";
import "./Booking.sol";

contract Escrow {
    Property propertyContract;
    Booking bookingContract;
    IERC20 usdcToken;

    mapping(uint256 => uint256) public bookingAmounts; //BookingId -> amount in escrow
    mapping(uint256 => bool) public isBookingPaid; //BookingID -> funds released to host

    constructor(address _propertyContractAddress, address _bookingContractAddress, address _usdcTokenAddress) {
        propertyContract = Property(_propertyContractAddress);
        bookingContract = Booking(_bookingContractAddress);
        usdcToken = IERC20(_usdcTokenAddress);
    }

    function deposit(uint256 bookingId, uint256 amount) external {
        require(bookingAmounts[bookingId] == 0, "Booking amount already deposited");
        bookingAmounts[bookingId] = amount;

        // Transfer USDC tokens to the escrow contract
        usdcToken.transferFrom(msg.sender, address(this), amount);
    }

    function release(uint256 bookingId) external {
        require(!isBookingPaid[bookingId], "Booking amount already released");
        uint256 amount = bookingAmounts[bookingId];
        require(amount > 0, "No booking amount to release");

        uint256 propertyId = bookingContract.getPropertyIdByBookingId(bookingId);
        address propertyOwner = propertyContract.getPropertyOwner(propertyId);
        require(propertyOwner != address(0), "Property owner not found");

        // Transfer USDC tokens from the escrow contract to the property owner
        usdcToken.transfer(propertyOwner, amount);

        isBookingPaid[bookingId] = true;
    }
}