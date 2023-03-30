pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract PropertyListing is ERC1155 {
    struct Property {
        string name;
        string description;
        string imageURI;
        uint256 price;
        bool isAvailable;
    }

    mapping (uint256 => Property) public properties;

    uint256 public nextPropertyId;

    constructor() ERC1155("https://example.com/api/{id}.json") {
        nextPropertyId = 1;
    }

    function createProperty(string memory _name, string memory _description, string memory _imageURI, uint256 _price) public {
        properties[nextPropertyId] = Property(_name, _description, _imageURI, _price, true);
        _mint(msg.sender, nextPropertyId, 1, "");
        nextPropertyId++;
    }

    function updateProperty(uint256 _propertyId, string memory _name, string memory _description, string memory _imageURI, uint256 _price, bool _isAvailable) public {
        require(_exists(_propertyId), "Property does not exist");
        properties[_propertyId].name = _name;
        properties[_propertyId].description = _description;
        properties[_propertyId].imageURI = _imageURI;
        properties[_propertyId].price = _price;
        properties[_propertyId].isAvailable = _isAvailable;
    }

    function buyProperty(uint256 _propertyId) public payable {
        require(_exists(_propertyId), "Property does not exist");
        require(properties[_propertyId].isAvailable, "Property is not available");
        require(msg.value >= properties[_propertyId].price, "Not enough ETH sent");
        properties[_propertyId].isAvailable = false;
        payable(msg.sender).transfer(msg.value);
        _safeTransferFrom(address(this), msg.sender, _propertyId, 1, "");
    }

    function cancelSale(uint256 _propertyId) public {
        require(_exists(_propertyId), "Property does not exist");
        require(ownerOf(_propertyId) == msg.sender, "Not property owner");
        properties[_propertyId].isAvailable = true;
        _safeTransferFrom(msg.sender, address(this), _propertyId, 1, "");
    }
}
