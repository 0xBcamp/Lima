contract BookingAvailabilityManagement {

    // Define variables to store property availability
    mapping(address => mapping(uint256 => bool)) public propertyAvailability;

    // Define variables to store booking details
    mapping(address => mapping(uint256 => Booking)) public propertyBookings;

    // Define a struct to store booking details
    struct Booking {
        uint256 checkIn;
        uint256 checkOut;
        address guest;
        bool confirmed;
    }

    // Define a function for hosts to update their property availability
    function updateAvailability(address _property, uint256 _date, bool _availability) public {
        require(msg.sender == _property, "Only property owner can update availability");
        propertyAvailability[_property][_date] = _availability;
    }

    // Define a function for guests to make booking requests
    function requestBooking(address _property, uint256 _checkIn, uint256 _checkOut) public {
        require(propertyAvailability[_property][_checkIn] && propertyAvailability[_property][_checkOut], "Property not available for requested dates");
        require(_checkOut > _checkIn, "Invalid check-out date");
        require(propertyBookings[_property][_checkIn].guest == address(0), "Property already booked for requested dates");

        // Store booking details
        Booking memory newBooking = Booking(_checkIn, _checkOut, msg.sender, false);
        propertyBookings[_property][_checkIn] = newBooking;
    }

    // Define a function for hosts to confirm a booking request
    function confirmBooking(address _property, uint256 _checkIn) public {
        require(msg.sender == _property, "Only property owner can confirm bookings");
        require(propertyBookings[_property][_checkIn].guest != address(0), "No booking request for requested dates");
        require(!propertyBookings[_property][_checkIn].confirmed, "Booking already confirmed");

        // Update booking status to confirmed
        propertyBookings[_property][_checkIn].confirmed = true;
    }

    // Define a function for guests to cancel a booking
    function cancelBooking(address _property, uint256 _checkIn) public {
        require(msg.sender == propertyBookings[_property][_checkIn].guest, "Only booking guest can cancel booking");
        require(propertyBookings[_property][_checkIn].confirmed, "Booking not confirmed");

        // Clear booking details
        delete propertyBookings[_property][_checkIn];
    }

}
