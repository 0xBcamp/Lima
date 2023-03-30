// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PropertyListing.sol";

contract SearchContract {
    
    PropertyListing private propertyListing;

    constructor(address _propertyListingAddress) {
        propertyListing = PropertyListing(_propertyListingAddress);
    }

    function searchProperties(
        uint256 _minPrice,
        uint256 _maxPrice,
        string memory _location,
        string memory _propertyType,
        bool _hasPool,
        bool _hasGarden,
        bool _hasInternet
    ) public view returns (uint256[] memory) {
        uint256[] memory properties = propertyListing.getProperties();
        uint256[] memory matchingProperties = new uint256[](properties.length);
        uint256 count = 0;
        
        for (uint256 i = 0; i < properties.length; i++) {
            if (
                propertyListing.getPrice(properties[i]) >= _minPrice &&
                propertyListing.getPrice(properties[i]) <= _maxPrice &&
                keccak256(bytes(propertyListing.getLocation(properties[i]))) == keccak256(bytes(_location)) &&
                keccak256(bytes(propertyListing.getPropertyType(properties[i]))) == keccak256(bytes(_propertyType)) &&
                propertyListing.hasAmenity(properties[i], "pool") == _hasPool &&
                propertyListing.hasAmenity(properties[i], "garden") == _hasGarden &&
                propertyListing.hasAmenity(properties[i], "internet") == _hasInternet
            ) {
                matchingProperties[count] = properties[i];
                count++;
            }
        }
        
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = matchingProperties[i];
        }
        return result;
    }
}
