import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { getDeployedContracts } from "./deployHelper";

describe("Booking tests", function () {
  let booking: Contract;
  let property: Contract;
  let user: Contract;
  let dummyUSDC: Contract;
  let owner: SignerWithAddress;
  let account1: SignerWithAddress;

  before(async function () {
    [owner, account1] = await ethers.getSigners();

    const contracts = await getDeployedContracts();

    dummyUSDC = contracts.dummyUSDC;
    user = contracts.user;
    property = contracts.property;
    booking = contracts.booking;
  });

  it("Should create a booking", async function () {
    const ownerRegistration = await user.registerUser("John", "Doe");
    await ownerRegistration.wait();

    const propertyRegistration = await property.connect(owner).registerProperty('Awesome Place', 'New York', 'USA', 'https://example.com/property/1', 1000000, 100, true);
    const propertyReceipt = await propertyRegistration.wait();
    const propertyId = propertyReceipt.events?.filter((x: any) => { return x.event === "PropertyRegistered" })[0].args.propertyId;

    const account1Registration = await user.connect(account1).registerUser("Jane", "Doe");
    await account1Registration.wait();

    // Prepare test data
    const startDate = BigNumber.from(1622487600);
    const endDate = BigNumber.from(1622764800);

    // Approve the required USDC amount for the user
    const totalPrice = BigNumber.from(400);
    const platformFeesAmount = totalPrice.mul(5).div(100);
    const totalAmount = totalPrice.add(platformFeesAmount);

    await dummyUSDC.connect(account1).approve(booking.address, totalAmount);

    // Call the createBooking function from the user's account
    const tx = await booking.connect(account1).createBooking(propertyId, startDate, endDate, { gasLimit: ethers.utils.parseUnits("30000000", "wei") });

    await expect(tx)
      .to.emit(booking, "BookingCreated")
      .withArgs(1, propertyId, account1.address, startDate, endDate);

    const receipt = await tx.wait();
    const bookingId = receipt.events?.filter((x: any) => { return x.event === "BookingCreated" })[0].args.bookingId;

    const bookingInfo = await booking.getBookingInfo(bookingId);

    expect(bookingInfo.propertyId).to.equal(propertyId);
    expect(bookingInfo.renter).to.equal(account1.address);
    expect(bookingInfo.startDate).to.equal(startDate);
    expect(bookingInfo.endDate).to.equal(endDate);

    // Add any additional checks, such as verifying the token balances or contract states
  });

  it.only("Should calculate total price and platform fees correctly", async function () {
    const ownerRegistration = await user.registerUser("John", "Doe");
    await ownerRegistration.wait();

    const pricePerNight = 100;
    const propertyRegistration = await property.connect(owner).registerProperty('Awesome Place', 'New York', 'USA', 'https://example.com/property/1', 1000000, pricePerNight, true);
    const propertyReceipt = await propertyRegistration.wait();
    const propertyId = propertyReceipt.events?.filter((x: any) => { return x.event === "PropertyRegistered" })[0].args.propertyId;

    const account1Registration = await user.connect(account1).registerUser("Jane", "Doe");
    await account1Registration.wait();

    // Set the start and end dates for the booking
    const startDate = 10;
    const endDate = 15;

    // Calculate the expected total price and platform fees
    const expectedTotalPrice = (endDate - startDate) * pricePerNight;
    const expectedPlatformFees = expectedTotalPrice * 5 / 100;

    // Approve the booking contract to spend the required USDC
    await dummyUSDC.connect(account1).approve(booking.address, expectedTotalPrice + expectedPlatformFees);

    // Get the initial USDC balances
    const initialUserBalance = await dummyUSDC.balanceOf(account1.address);
    console.log('initialUserBalance :>> ', initialUserBalance.toString());
    // const initialEscrowBalance = await dummyUSDC.balanceOf(escrow.address);
    // const initialRewardsBalance = await dummyUSDC.balanceOf(rewards.address);

    // Create the booking
    await booking.connect(account1).createBooking(propertyId, startDate, endDate);

    // Get the final USDC balances
    const finalUserBalance = await dummyUSDC.balanceOf(account1.address);
    console.log('finalUserBalance :>> ', finalUserBalance.toString());
    // const finalEscrowBalance = await dummyUSDC.balanceOf(escrow.address);
    // const finalRewardsBalance = await dummyUSDC.balanceOf(rewards.address);

    // Check if the USDC balances have changed as expected
    expect(initialUserBalance - finalUserBalance).to.equal(expectedTotalPrice + expectedPlatformFees);
    // expect(finalEscrowBalance - initialEscrowBalance).to.equal(expectedTotalPrice);
    // expect(finalRewardsBalance - initialRewardsBalance).to.equal(expectedPlatformFees);
  });
});
