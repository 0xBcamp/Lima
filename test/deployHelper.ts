const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function getDeployedContracts() {

    await hre.run("deploy");

    // Read the contract addresses from the JSON file
    const contractAddresses = JSON.parse(
        fs.readFileSync(path.join(__dirname, "contractAddresses.json"), "utf8")
    );

    const DummyUSDC = await hre.ethers.getContractFactory("DummyUSDC");
    const dummyUSDC = await DummyUSDC.attach(contractAddresses.dummyUSDC);

    const Rewards = await hre.ethers.getContractFactory("Rewards");
    const rewards = await Rewards.attach(contractAddresses.rewards);

    const User = await hre.ethers.getContractFactory("User");
    const user = await User.attach(contractAddresses.user);

  
    const Property = await hre.ethers.getContractFactory("Property");
    const property = Property.attach(contractAddresses.property);

  
    const Escrow = await hre.ethers.getContractFactory("Escrow");
    const escrow = await Escrow.attach(contractAddresses.escrow);

  
    const Booking = await hre.ethers.getContractFactory("Booking");
    const booking = await Booking.attach(contractAddresses.booking);

  
    const Messaging = await hre.ethers.getContractFactory("Messaging");
    const messaging = await Messaging.attach(contractAddresses.messaging);


    const Review = await hre.ethers.getContractFactory("Review");
    const review = await Review.attach(contractAddresses.review);


    // Return the deployed contract instances
    return { dummyUSDC, rewards, user, property, escrow, booking, messaging, review };
}

export { getDeployedContracts };