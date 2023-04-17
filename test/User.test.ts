import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { getDeployedContracts } from "./deployHelper";

describe("User", function () {
    let user: Contract;
    let dummyUSDC: Contract;
    let rewards: Contract;

    let owner: SignerWithAddress;

    const userTokenUri = "12345";

    beforeEach(async () => {
        const contracts = await getDeployedContracts();

        dummyUSDC = contracts.dummyUSDC;
        rewards = contracts.rewards;
        user = contracts.user;

        [owner] = await ethers.getSigners();
    });

    it("Should register a new user", async function () {
        const userRegistration = await user.registerUser(userTokenUri);
        const tokenId = await userRegistration.wait();

        expect(tokenId).to.not.equal(0);
        expect(await user.userExists(owner.address)).to.equal(true);
    });

    it("Should not allow a user to register twice", async function () {
        await user.registerUser(userTokenUri);
    
        expect(await user.userExists(owner.address)).to.equal(true);
    
        await expect(user.registerUser(userTokenUri)).to.be.revertedWith("User is already registered");
      });

    it("Should return false for non-existent users", async function () {
        expect(await user.userExists(owner.address)).to.equal(false);
    });

    it("Should award 50 points to a user for registering", async function () {
        // Register a user
        await user.registerUser(userTokenUri);

        // Get the current month based on the block timestamp.
        const currentMonth = Math.floor(Date.now() / 1000 / 86400 / 30);

        // Check if the user's points for the current month are equal to 20
        const userPoints = await rewards.userMonthPoints(owner.address, currentMonth);
        expect(userPoints.toString()).to.equal("50");
    });
});