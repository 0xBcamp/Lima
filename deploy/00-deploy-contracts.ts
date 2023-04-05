import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

  

  const [deployer] = await hre.ethers.getSigners();

  const DummyUSDC = await hre.ethers.getContractFactory("DummyUSDC");
  const dummyUSDC = await DummyUSDC.deploy();
  await dummyUSDC.deployed();

  const Property = await hre.ethers.getContractFactory("Property");
  const property = await Property.deploy();
  await property.deployed();

  const User = await hre.ethers.getContractFactory("User");
  const user = await User.deploy();
  await user.deployed();

  const Rewards = await hre.ethers.getContractFactory("Rewards");
  const rewards = await Rewards.deploy(dummyUSDC.address);
  await rewards.deployed();

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

  console.log("DummyUSDC deployed to:", dummyUSDC.address);
  console.log("Property deployed to:", property.address);
  console.log("User deployed to:", user.address);
  console.log("Rewards deployed to:", rewards.address);
  console.log("Escrow deployed to:", escrow.address);
  console.log("Booking deployed to:", booking.address);
  console.log("Messaging deployed to:", messaging.address);
  console.log("Review deployed to:", review.address);
};

export default func;
func.tags = ["User"];