pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract User is ERC721 {
    using Counters for Counters.Counter;
    using Strings for uint256;

    event UserNFTMinted(
        address indexed owner,
        uint256 indexed tokenId,
        string tokenURI
    );

    Counters.Counter private _tokenIds;
    mapping(uint256 => string) private _tokenURIs;

    uint256 public myCounter;

    constructor() ERC721("UserNFT", "UNFT") {}

    function mintUserNFT(string memory _tokenURI) public returns (uint256) {
        //require(1 == 2, "Wrong TokenURI");
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        //Reward user point for creating a profile.

        emit UserNFTMinted(msg.sender, newItemId, _tokenURI);

        return newItemId;
    }

    function _setTokenURI(
        uint256 tokenId,
        string memory _tokenURI
    ) internal virtual {
        require(
            _exists(tokenId),
            "ERC721URIStorage: URI set of nonexistent token"
        );
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721URIStorage: URI query for nonexistent token"
        );

        string memory _tokenURI = _tokenURIs[tokenId];
        return _tokenURI;
    }
}
