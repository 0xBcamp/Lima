pragma solidity ^0.8.0;

contract AuctionContract {
    struct Auction {
        address payable seller;
        uint256 startBlock;
        uint256 endBlock;
        uint256 startingPrice;
        uint256 reservePrice;
        address highestBidder;
        uint256 highestBid;
        bool ended;
    }

    mapping (uint256 => Auction) public auctions;
    uint256 public auctionCounter;

    event AuctionCreated(uint256 auctionId);
    event AuctionEnded(uint256 auctionId, address winner, uint256 highestBid);

    function createAuction(uint256 startBlock, uint256 endBlock, uint256 startingPrice, uint256 reservePrice) public {
        require(startBlock > block.number, "Auction start block must be in the future");
        require(endBlock > startBlock, "Auction end block must be after start block");
        require(startingPrice > 0, "Starting price must be greater than 0");
        require(reservePrice > 0, "Reserve price must be greater than 0");
        auctions[auctionCounter] = Auction(msg.sender, startBlock, endBlock, startingPrice, reservePrice, address(0), 0, false);
        emit AuctionCreated(auctionCounter);
        auctionCounter++;
    }

    function bid(uint256 auctionId) public payable {
        Auction storage auction = auctions[auctionId];
        require(block.number >= auction.startBlock, "Auction has not started yet");
        require(block.number <= auction.endBlock, "Auction has ended");
        require(msg.value > auction.highestBid, "Bid must be greater than highest bid");
        require(msg.value >= auction.startingPrice, "Bid must be greater than or equal to starting price");

        if (auction.highestBidder != address(0)) {
            auction.highestBidder.transfer(auction.highestBid);
        }
        auction.highestBidder = msg.sender;
        auction.highestBid = msg.value;
    }

    function endAuction(uint256 auctionId) public {
        Auction storage auction = auctions[auctionId];
        require(block.number > auction.endBlock, "Auction has not ended yet");
        require(!auction.ended, "Auction already ended");
        if (auction.highestBid >= auction.reservePrice) {
            auction.seller.transfer(auction.highestBid);
            emit AuctionEnded(auctionId, auction.highestBidder, auction.highestBid);
        } else {
            auction.ended = true;
        }
    }
}
