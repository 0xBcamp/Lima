pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Property is ERC1155 {
    using Counters for Counters.Counter;

    uint256 public constant TOTAL_SHARES = 1000000;

    struct PropertyInfo {
        uint256 propertyId;
        address owner;
        string name;
        string location;
        string uri;
        bool fractionalOwnershipEnabled;
        uint256 totalShares;
        uint256 priceUSD;
    }

    

    event PropertyRegistered(
        uint256 indexed propertyId,
        address indexed owner,
        string name,
        string location,
        string uri
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

    constructor() ERC1155("") {}

    function registerProperty(
        string memory name,
        string memory location,
        string memory uri,
        uint256 priceUSD,
        bool enableFractional
    ) public returns (uint256) {
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
            priceUSD: priceUSD
        });

        if (enableFractional) {
            _propertyShares[newPropertyId][msg.sender] = TOTAL_SHARES;
        }

        emit PropertyRegistered(newPropertyId, msg.sender, name, location, uri);

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
        require(_propertyShares[propertyId][msg.sender] >= amount, "Insufficient shares.");

        _propertyShares[propertyId][msg.sender] -= amount;
        _propertyShares[propertyId][to] += amount;

        emit SharesTransferred(propertyId, msg.sender, to, amount);
    }

    function isFractionalOwnershipEnabled(
        uint256 propertyId
    ) public view returns (bool) {
        return _properties[propertyId].fractionalOwnershipEnabled;
    }

    function getPropertyInfo(
        uint256 propertyId
    ) public view returns (PropertyInfo memory) {
        return _properties[propertyId];
    }

    function getShares(
        uint256 propertyId,
        address owner
    ) public view returns (uint256) {
        return _propertyShares[propertyId][owner];
    }
}
