// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Booking.sol";
import "./Property.sol";
import "./Rewards.sol";
import "./interfaces/IRewards.sol";
import "./enums/UserPointType.sol";

// This contract manages reviews submitted by users after completing their stays.
contract Review {
    // Struct to store information about a booking review.
    struct BookingReview {
        uint256 rating;
        string comment;
        uint256 timestamp;
    }

    // Mapping to store reviews by booking ID and reviewer address.
    mapping(uint256 => mapping(address => BookingReview)) private _bookingReviews;

    Booking public bookingContract;
    Property public propertyContract;
    IRewards public rewardsContract;

    event ReviewSubmitted(address indexed reviewer, uint256 propertyId, uint256 bookingId, BookingReview review);

    constructor(address _bookingContractAddress, address _propertyContractAddress, address _rewardsContractAddress) {
        bookingContract = Booking(_bookingContractAddress);
        propertyContract = Property(_propertyContractAddress);
        rewardsContract = IRewards(_rewardsContractAddress);
    }

    // Function to submit a review for a completed booking.
    function submitReview(uint256 propertyId, uint256 bookingId, uint256 rating, string memory comment) external {
        // Check if the rating is between 1 and 5.
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");

        // Check if the property ID is valid.
        require(propertyContract.isValidProperty(propertyId), "Invalid property ID");

        // Check if the booking was completed by the user.
        require(bookingContract.isBookingCompleted(msg.sender, propertyId, bookingId), "Booking not completed by the user");

        BookingReview memory newReview = BookingReview({
            rating: rating,
            comment: comment,
            timestamp: block.timestamp
        });

        _bookingReviews[bookingId][msg.sender] = newReview;

        // Award user points for submitting a review.
        rewardsContract.addUserPoints(msg.sender, UserPointType.ReviewSubmitted);

        emit ReviewSubmitted(msg.sender, propertyId, bookingId, newReview);
    }

}