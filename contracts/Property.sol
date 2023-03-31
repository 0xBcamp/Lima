pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Property is ERC1155 {
    using Counters for Counters.Counter;

    //Setting a fixed amount of shares for each property - not price related
    uint256 public constant TOTAL_SHARES = 1000000;

    struct PropertyInfo {
        uint256 propertyId;
        address owner;
        string name;
        string location;
        string uri;
        bool fractionalOwnershipEnabled;
        uint256 totalShares;
        uint256 pricePerNight;
        uint256 priceUSD;
    }

    event PropertyRegistered(
        uint256 indexed propertyId,
        address indexed owner,
        string name,
        string location,
        string uri,
        uint256 pricePerNight
    );

    event SharesTransferred(
        uint256 indexed propertyId,
        address indexed from,
        address indexed to,
        uint256 amount
    );

    Counters.Counter private _propertyIds;
    mapping(uint256 => PropertyInfo) private _properties; 
    mapping(uint256 => mapping(address => uint256)) private _propertyShares;

    // Key 1 (uint256): The Property ID.
    // Key 2 (uint256): The Unix timestamp with day granularity (ignores time of day).
    // Value (bool): The availability status of the property on that date (true for unavailable, false for available).
    mapping(uint256 => mapping(uint256 => bool)) private _unavailableDates;

    constructor() ERC1155("") {}

    function registerProperty(string memory name, string memory location, string memory uri, uint256 priceUSD, uint256 pricePerNightUSD, bool enableFractional) public returns (uint256) {
        _propertyIds.increment();
        uint256 newPropertyId = _propertyIds.current();

        _mint(msg.sender, newPropertyId, 1, "");

        _properties[newPropertyId] = PropertyInfo({
            propertyId: newPropertyId,
            owner: msg.sender,
            name: name,
            location: location,
            uri: uri,
            fractionalOwnershipEnabled: enableFractional,
            totalShares: TOTAL_SHARES,
            priceUSD: priceUSD,
            pricePerNight: pricePerNightUSD
        });

        if (enableFractional) {
            _propertyShares[newPropertyId][msg.sender] = TOTAL_SHARES;
        }

        emit PropertyRegistered(newPropertyId, msg.sender, name, location, uri, pricePerNightUSD);

        return newPropertyId;
    }

    function enableFractionalShares(
        uint256 propertyId,
        uint256 totalShares
    ) public {
        PropertyInfo storage property = _properties[propertyId];
        require(
            msg.sender == property.owner,
            "Only the owner can enable fractional ownership."
        );
        require(
            !property.fractionalOwnershipEnabled,
            "Fractional ownership is already enabled."
        );

        property.totalShares = totalShares;
        _propertyShares[propertyId][msg.sender] = TOTAL_SHARES;
        property.fractionalOwnershipEnabled = true;
    }

    function transferShares(
        uint256 propertyId,
        address to,
        uint256 amount
    ) public {
        PropertyInfo storage property = _properties[propertyId];
        require(
            property.fractionalOwnershipEnabled,
            "Fractional ownership is not enabled."
        );
        require(
            _propertyShares[propertyId][msg.sender] >= amount,
            "Insufficient shares."
        );

        _propertyShares[propertyId][msg.sender] -= amount;
        _propertyShares[propertyId][to] += amount;

        emit SharesTransferred(propertyId, msg.sender, to, amount);
    }

    function isPropertyAvailable(uint256 _propertyId, uint256 _startDate, uint256 _endDate) public view returns (bool) {
        require(_properties[_propertyId].owner != address(0), "Property does not exist");

        // Loop through each date between the provided start and end dates (excluding the end date itself).
        for (uint256 date = _startDate; date < _endDate; date++) {
            // Check if the property is unavailable for the current date in the loop.
            // If it is unavailable, return false, indicating that the property is not available for the entire date range.
            if (_unavailableDates[_propertyId][date]) {
                return false;
            }
        }

        // If the loop completes without finding any unavailable date, return true,
        // indicating that the property is available for the entire date range.
        return true;
    }

    // Marking all the provided dates for the property as available again
    function updateAvailability(uint256 _propertyId, uint256 _startDate, uint256 _endDate) external {
        // Check if the property with the given propertyId exists, by verifying that the owner is not the zero address.
        require(_properties[_propertyId].owner != address(0), "Property does not exist");

        // Loop through each date between the provided start and end dates (excluding the end date itself).
        for (uint256 date = _startDate; date < _endDate; date++) {
            _unavailableDates[_propertyId][date] = true;
        }
    }

    function getTotalPriceForDates(uint256 _propertyId, uint256 _startDate, uint256 _endDate) public view returns (uint256) {
        require(_startDate < _endDate, "Start date must be before end date");

        //Getting the selected property info
        PropertyInfo storage property = _properties[_propertyId];       

        //Converting timestamp to the number of days
        uint256 bookingDuration = (_endDate - _startDate) / 1 days;  
        uint256 totalPrice = property.pricePerNight * bookingDuration;
        return totalPrice;
    }

    function getPropertyOwner(uint256 _propertyId) public view returns (address) {
        require(_propertyId <= _propertyIds.current(), "Property does not exist");
        return _properties[_propertyId].owner;
    }

    function isFractionalOwnershipEnabled(
        uint256 propertyId
    ) public view returns (bool) {
        return _properties[propertyId].fractionalOwnershipEnabled;
    }

    function getPropertyInfo(uint256 propertyId) public view returns (PropertyInfo memory) {
        return _properties[propertyId];
    }

    function getShares(uint256 propertyId, address owner) public view returns (uint256) {
        return _propertyShares[propertyId][owner];
    }

    // Convert the given Unix timestamp to a day-granular timestamp by dividing it by the number of seconds in a day (86400).
    // This removes the time-of-day information and retains only the date, making it suitable for daily-based bookings.
    function toDayTimestamp(uint256 timestamp) public pure returns (uint256) {
        uint256 dayTimestamp = timestamp / 86400;
        return dayTimestamp;
    }
}
