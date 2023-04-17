import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const fs = require("fs");
const path = require("path");

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

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

  // Save the contract addresses to a JSON file
  const contractAddresses = {
    dummyUSDC: dummyUSDC.address,
    property: property.address,
    user: user.address,
    rewards: rewards.address,
    escrow: escrow.address,
    booking: booking.address,
    messaging: messaging.address,
    review: review.address,
  };

  let fileName = "contractAddresses.json";

  if (hre.network.name === "hardhat") {
    //Sending USDC
    const tokensToSend = hre.ethers.utils.parseUnits("10000", 18);

    for (let i = 1; i < accounts.length; i++) {
      const recipient = accounts[i];
      await dummyUSDC.transfer(recipient.address, tokensToSend);
    }

  } else {
    console.log("starting contract verifying...");
    
    fileName = `contractAddresses_${hre.network.name}.json`;

    await hre.run("verify:verify", { address: dummyUSDC.address, constructorArguments: []});
    console.log("dummyUSDC verified");

    await hre.run("verify:verify", { address: property.address, constructorArguments: [rewards.address, dummyUSDC.address]});
    console.log("property verified");

    await hre.run("verify:verify", { address: user.address, constructorArguments: [rewards.address]});
    console.log("user verified");

    await hre.run("verify:verify", { address: rewards.address, constructorArguments: [dummyUSDC.address]});
    console.log("rewards verified");

    await hre.run("verify:verify", { address: escrow.address, constructorArguments: [dummyUSDC.address]});
    console.log("escrow verified");

    await hre.run("verify:verify", { address: booking.address, constructorArguments: [dummyUSDC.address]});
    console.log("booking verified");

    await hre.run("verify:verify", { address: messaging.address, constructorArguments: [booking.address, property.address]});
    console.log("messaging verified");

    await hre.run("verify:verify", { address: review.address, constructorArguments: [booking.address, property.address, rewards.address]});
    console.log("review verified");

    console.log("Verifying contracts complete!");
  }

  fs.writeFileSync(
    path.join(__dirname, "..", "test", fileName),
    JSON.stringify(contractAddresses)
  );
};

export default func;
func.tags = ["User"];