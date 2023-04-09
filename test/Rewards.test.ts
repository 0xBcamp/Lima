import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { getDeployedContracts } from "./deployHelper";

describe("Rewards contract", function () {
    let dummyUSDC: Contract;
    let rewards: Contract;

    let owner: SignerWithAddress;
    let account1: SignerWithAddress;

    const points = {
        UserRegistered: 50,
        PropertyRegistered: 200,
        ReviewSubmitted: 100,
        BookingCreated: 100,
        BookingReceived: 50,
    };

    beforeEach(async () => {
        const contracts = await getDeployedContracts();

        dummyUSDC = contracts.dummyUSDC;
        rewards = contracts.rewards;

        [owner, account1] = await ethers.getSigners();
    });

    it("Should set initial point allocations correctly", async function () {
        const userRegisteredPoints = await rewards.pointAllocations(0);
        const propertyRegisteredPoints = await rewards.pointAllocations(1);
        const reviewSubmittedPoints = await rewards.pointAllocations(2);
        const bookingCreatedPoints = await rewards.pointAllocations(3);
        const bookingReceivedPoints = await rewards.pointAllocations(4);
   
        expect(userRegisteredPoints).to.equal(points.UserRegistered);
        expect(propertyRegisteredPoints).to.equal(points.PropertyRegistered);
        expect(reviewSubmittedPoints).to.equal(points.ReviewSubmitted);
        expect(bookingCreatedPoints).to.equal(points.BookingCreated);
        expect(bookingReceivedPoints).to.equal(points.BookingReceived);
    });

    it("Should add user points for ReviewSubmitted", async function () {
        await rewards.addUserPoints(account1.address, 2);
        const currentMonth = Math.floor(Date.now() / 1000 / (30 * 24 * 60 * 60));
        const userPoints = await rewards.userMonthPoints(account1.address, currentMonth);
        const totalPoints = await rewards.totalMonthPoints(currentMonth);

        expect(userPoints).to.equal(points.ReviewSubmitted);
        expect(totalPoints).to.equal(points.ReviewSubmitted);
    });
});