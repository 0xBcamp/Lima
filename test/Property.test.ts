import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
const { parseUnits } = ethers.utils;

import { getDeployedContracts } from "./deployHelper";

describe("Property", function () {
  let property: Contract;
  let dummyUSDC: Contract;
  let rewards: Contract;

  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();

    const contracts = await getDeployedContracts();

    dummyUSDC = contracts.dummyUSDC;
    rewards = contracts.rewards;
    property = contracts.property;

  });

  describe('registerProperty', async () => {
    it('Should create a new property and emit PropertyRegistered event', async function () {
      const tx = await property.connect(owner).registerProperty(
        'Awesome Place',
        'New York',
        'USA',
        'https://example.com/property/1',
        1000000,
        200,
        true
      );

      await expect(tx)
        .to.emit(property, 'PropertyRegistered')
        .withArgs(
          1,
          owner.address,
          'Awesome Place',
          'New York',
          'USA',
          'https://example.com/property/1',
          200
        );

      const propertyInfo = await property.getPropertyInfo(1);

      expect(propertyInfo.propertyId).to.equal(1);
      expect(propertyInfo.owner).to.equal(owner.address);
      expect(propertyInfo.name).to.equal('Awesome Place');
      expect(propertyInfo.location).to.equal('New York');
      expect(propertyInfo.country).to.equal('USA');
      expect(propertyInfo.uri).to.equal('https://example.com/property/1');
      expect(propertyInfo.pricePerNight).to.equal(200);
    });
  });

  it("Should award 200 points to a user for registering a property", async function () {
    const propertyRegistration = await property.connect(owner).registerProperty('Awesome Place', 'New York', 'USA', 'https://example.com/property/1', 1000000, 100, true);
    await propertyRegistration.wait();

    // Get the current month based on the block timestamp.
    const currentMonth = Math.floor(Date.now() / 1000 / 86400 / 30);

    // Check if the user's points for the current month are equal to 20
    const userPoints = await rewards.userMonthPoints(owner.address, currentMonth);
    expect(userPoints.toString()).to.equal("200");
  });

  describe("getTotalPriceForDates", function () {
    let propertyId: number;
    const pricePerNight = 100; //Price in USDC

    beforeEach(async () => {
      [owner, addr1, addr2] = await ethers.getSigners();

      const contracts = await getDeployedContracts();

      dummyUSDC = contracts.dummyUSDC;
      rewards = contracts.rewards;
      property = contracts.property;

      const propertyRegistration = await property.connect(owner).registerProperty('Awesome Place', 'New York', 'USA', 'https://example.com/property/1', 1000000, pricePerNight, true);
      const propertyReceipt = await propertyRegistration.wait();
      propertyId = propertyReceipt.events?.filter((x: any) => { return x.event === "PropertyRegistered" })[0].args.propertyId;

    });

    it("Should return correct total price for valid dates", async function () {
      const startDate = 1681133170;
      const endDate = 1681392370; // 3 days later

      // Call the function and check the result
      const totalPrice = await property.getTotalPriceForDates(propertyId, startDate, endDate);
      expect(totalPrice).to.equal(parseUnits(pricePerNight.toString(), "18").mul(3));
    });

    it("Should revert when start date is equal to or greater than end date", async function () {
      // Define invalid start and end dates
      const startDate = 1681133170;
      const endDate = startDate; // same as start date

      // Check if the transaction reverts
      await expect(property.getTotalPriceForDates(0, startDate, endDate)).to.be.revertedWith(
        "Start date must be before end date"
      );
    });

    it("Should revert when property id is invalid", async function () {
      const startDate = 1681133170;
      const endDate = 1681392370; // 3 days later

      // Check if the transaction reverts due to invalid property id
      await expect(property.getTotalPriceForDates(10, startDate, endDate)).to.be.revertedWith(
        "Invalid property"
      );
    });
  });
});