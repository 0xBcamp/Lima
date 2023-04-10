import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
const { parseUnits } = ethers.utils;

import { getDeployedContracts } from "./deployHelper";

describe("Booking tests", function () {
  let booking: Contract;
  let property: Contract;
  let user: Contract;
  let dummyUSDC: Contract;
  let rewards: Contract;
  let escrow: Contract;

  let owner: SignerWithAddress;
  let account1: SignerWithAddress;

  let propertyId: number;
  let pricePerNight = 100;

  before(async function () {
    [owner, account1] = await ethers.getSigners();

    const contracts = await getDeployedContracts();

    dummyUSDC = contracts.dummyUSDC;
    user = contracts.user;
    property = contracts.property;
    booking = contracts.booking;
    rewards = contracts.rewards;
    escrow = contracts.escrow;

    const ownerRegistration = await user.registerUser("John", "Doe");
    await ownerRegistration.wait();

    const propertyRegistration = await property.connect(owner).registerProperty('Awesome Place', 'New York', 'USA', 'https://example.com/property/1', 1000000, pricePerNight, true);
    const propertyReceipt = await propertyRegistration.wait();
    propertyId = propertyReceipt.events?.filter((x: any) => { return x.event === "PropertyRegistered" })[0].args.propertyId;

    const account1Registration = await user.connect(account1).registerUser("Jane", "Doe");
    await account1Registration.wait();

  });

  it("Should create a booking", async function () {
    const startDate = 1681133170;
    const endDate = 1681392370; // 3 days later

    const totalPrice = parseUnits("300", "18");
    const platformFeesAmount = totalPrice.mul(5).div(100);
    const totalAmount = totalPrice.add(platformFeesAmount);

    // Approve the required USDC amount for the user
    await dummyUSDC.connect(account1).approve(booking.address, totalAmount);

    // Call the createBooking function from the user's account
    const tx = await booking.connect(account1).createBooking(propertyId, startDate, endDate, { gasLimit: ethers.utils.parseUnits("30000000", "wei") });

    //Checking that the event is created
    await expect(tx).to.emit(booking, "BookingCreated").withArgs(1, propertyId, account1.address, startDate, endDate);

    const receipt = await tx.wait();
    const bookingId = receipt.events?.filter((x: any) => { return x.event === "BookingCreated" })[0].args.bookingId;

    //Check that the booking is created
    const bookingInfo = await booking.getBookingInfo(bookingId);

    expect(bookingInfo.propertyId).to.equal(propertyId);
    expect(bookingInfo.renter).to.equal(account1.address);
    expect(bookingInfo.startDate).to.equal(startDate);
    expect(bookingInfo.endDate).to.equal(endDate);
  });

  it("Should calculate total price and platform fees correctly", async function () {
    const startDate = 1681133170; //10 Apr 2023 20:14:11 GMT
    const endDate = 1681589651; // 15 Apr 2023 20:14:11 GMT

    // Calculate the expected total price and platform fees
    const bookingDuration = Math.floor((endDate - startDate) / 86400);

    const totalPrice = bookingDuration * pricePerNight;
    const expectedTotalPrice = parseUnits(totalPrice.toString(), 18);;
    const expectedPlatformFees = expectedTotalPrice.mul(5).div(100);

    // Approve the booking contract to spend the required USDC
    await dummyUSDC.connect(account1).approve(booking.address, expectedTotalPrice.add(expectedPlatformFees));

    // Get the initial USDC balances
    const initialUserBalance = await dummyUSDC.balanceOf(account1.address);

    // Create the booking
    const bookingTx = await booking.connect(account1).createBooking(propertyId, startDate, endDate);
    await bookingTx.wait();

    // Get the final USDC balances
    const finalUserBalance = await dummyUSDC.balanceOf(account1.address);

    // Check if the USDC balances have changed as expected
    const userBalanceChange = initialUserBalance.sub(finalUserBalance);
    expect(userBalanceChange.toString()).to.equal(expectedTotalPrice.add(expectedPlatformFees).toString());
  });

  it("platform fees should be moved to the rewards contract", async function () {
    const startDate = 1681133170; //10 Apr 2023 20:14:11 GMT
    const endDate = 1681589651; // 15 Apr 2023 20:14:11 GMT

    // Calculate the expected total price and platform fees
    const bookingDuration = Math.floor((endDate - startDate) / 86400);
    const totalPrice = bookingDuration * pricePerNight;
    const expectedTotalPrice = parseUnits(totalPrice.toString(), 18);;
    const expectedPlatformFees = expectedTotalPrice.mul(5).div(100);

    // Approve the booking contract to spend the required USDC
    await dummyUSDC.connect(account1).approve(booking.address, expectedTotalPrice.add(expectedPlatformFees));

    // Get the initial Rewards USDC balance
    const initialRewardsBalance = await dummyUSDC.balanceOf(rewards.address);

    // Create the booking
    const bookingTx = await booking.connect(account1).createBooking(propertyId, startDate, endDate);
    await bookingTx.wait();

    // Get the final USDC balances
    const finalRewardsBalance = await dummyUSDC.balanceOf(rewards.address);

    // Check if the USDC balances have changed as expected
    const rewardsBalanceChange = finalRewardsBalance.sub(initialRewardsBalance);
    expect(rewardsBalanceChange.toString()).to.equal(expectedPlatformFees.toString());
  });

  it("booking fees should be moved to the escrow contract", async function () {
    const startDate = 1681133170; //10 Apr 2023 20:14:11 GMT
    const endDate = 1681589651; // 15 Apr 2023 20:14:11 GMT

    // Calculate the expected total price and platform fees
    const bookingDuration = Math.floor((endDate - startDate) / 86400);
    const totalPrice = bookingDuration * pricePerNight;
    const expectedTotalPrice = parseUnits(totalPrice.toString(), 18);;
    const expectedPlatformFees = expectedTotalPrice.mul(5).div(100);

    // Approve the booking contract to spend the required USDC
    await dummyUSDC.connect(account1).approve(booking.address, expectedTotalPrice.add(expectedPlatformFees));

    // Get the initial Rewards USDC balance
    const initialEscrowBalance = await dummyUSDC.balanceOf(escrow.address);

    // Create the booking
    const bookingTx = await booking.connect(account1).createBooking(propertyId, startDate, endDate);
    await bookingTx.wait();

    // Get the final USDC balances
    const finalEscrowBalance = await dummyUSDC.balanceOf(escrow.address);

    // Check if the USDC balances have changed as expected
    const escrowBalanceChange = finalEscrowBalance.sub(initialEscrowBalance);
    expect(escrowBalanceChange.toString()).to.equal(expectedTotalPrice.toString());
  });

  it("Should award 100 points to a guest for making a booking", async function () {
    const startDate = 1681133170; //10 Apr 2023 20:14:11 GMT
    const endDate = 1681589651; // 15 Apr 2023 20:14:11 GMT

    // Calculate the expected total price and platform fees
    const bookingDuration = Math.floor((endDate - startDate) / 86400);
    const totalPrice = bookingDuration * pricePerNight;
    const expectedTotalPrice = parseUnits(totalPrice.toString(), 18);;
    const expectedPlatformFees = expectedTotalPrice.mul(5).div(100);

    // Approve the booking contract to spend the required USDC
    await dummyUSDC.connect(account1).approve(booking.address, expectedTotalPrice.add(expectedPlatformFees));

    // Get the current month based on the block timestamp.
    const currentMonth = Math.floor(Date.now() / 1000 / 86400 / 30);

    // Get the initial user points
    const initialUserPoints = await rewards.userMonthPoints(account1.address, currentMonth);

    // Create the booking
    const bookingTx = await booking.connect(account1).createBooking(propertyId, startDate, endDate);
    await bookingTx.wait();

    // Get the final user points
    const finalUserPoints = await rewards.userMonthPoints(account1.address, currentMonth);

    // Check if the user points has changed
    const userPointChange = finalUserPoints.sub(initialUserPoints);
    expect(userPointChange.toString()).to.equal("100");
  });

  it("Should award 50 points to a host for receiving a booking", async function () {
    const startDate = 1681133170; //10 Apr 2023 20:14:11 GMT
    const endDate = 1681589651; // 15 Apr 2023 20:14:11 GMT

    // Calculate the expected total price and platform fees
    const bookingDuration = Math.floor((endDate - startDate) / 86400);
    const totalPrice = bookingDuration * pricePerNight;
    const expectedTotalPrice = parseUnits(totalPrice.toString(), 18);;
    const expectedPlatformFees = expectedTotalPrice.mul(5).div(100);

    // Approve the booking contract to spend the required USDC
    await dummyUSDC.connect(account1).approve(booking.address, expectedTotalPrice.add(expectedPlatformFees));

    // Get the current month based on the block timestamp.
    const currentMonth = Math.floor(Date.now() / 1000 / 86400 / 30);

    // Get the initial user points
    const initialUserPoints = await rewards.userMonthPoints(owner.address, currentMonth);

    // Create the booking
    const bookingTx = await booking.connect(account1).createBooking(propertyId, startDate, endDate);
    await bookingTx.wait();

    // Get the final user points
    const finalUserPoints = await rewards.userMonthPoints(owner.address, currentMonth);

    // Check if the user points has changed
    const userPointChange = finalUserPoints.sub(initialUserPoints);
    expect(userPointChange.toString()).to.equal("50");
  });
});
