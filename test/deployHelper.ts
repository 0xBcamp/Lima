const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function getDeployedContracts() {

    const accounts = await hre.ethers.getSigners();

    const DummyUSDC = await hre.ethers.getContractFactory("DummyUSDC");
    const dummyUSDC = await DummyUSDC.deploy();
    await dummyUSDC.deployed();
  
    const Rewards = await hre.ethers.getContractFactory("Rewards");
    const rewards = await Rewards.deploy(dummyUSDC.address);
    await rewards.deployed();
  
    const User = await hre.ethers.getContractFactory("User");
    const user = await User.deploy(rewards.address);
    await user.deployed();
  
    const Property = await hre.ethers.getContractFactory("Property");
    const property = await Property.deploy(rewards.address, dummyUSDC.address);
    await property.deployed();
  
    const Escrow = await hre.ethers.getContractFactory("Escrow");
    const escrow = await Escrow.deploy(dummyUSDC.address);
    await escrow.deployed();
  
    const Booking = await hre.ethers.getContractFactory("Booking");
    const booking = await Booking.deploy(dummyUSDC.address);
    await booking.deployed();
  
    const Messaging = await hre.ethers.getContractFactory("Messaging");
    const messaging = await Messaging.deploy(booking.address, property.address);
    await messaging.deployed();
  
    const Review = await hre.ethers.getContractFactory("Review");
    const review = await Review.deploy(booking.address, property.address, rewards.address);
    await review.deployed();
  
    // Call the setContracts function in each contract to set the contract addresses
    await escrow.setContracts(property.address, booking.address, rewards.address);
    await booking.setContracts(user.address, property.address, escrow.address, rewards.address);

    await rewards.addToWhitelist(property.address);
    await rewards.addToWhitelist(user.address);
    await rewards.addToWhitelist(booking.address);
    await rewards.addToWhitelist(messaging.address);
    await rewards.addToWhitelist(review.address);

    //Sending USDC
    const tokensToSend = hre.ethers.utils.parseUnits("10000", 18);

    for (let i = 1; i < accounts.length; i++) {
      const recipient = accounts[i];
      await dummyUSDC.transfer(recipient.address, tokensToSend);
    }
    
    // Return the deployed contract instances
    return { dummyUSDC, rewards, user, property, escrow, booking, messaging, review };
}

export { getDeployedContracts };