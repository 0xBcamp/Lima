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

    beforeEach(async () => {
        const contracts = await getDeployedContracts();

        dummyUSDC = contracts.dummyUSDC;
        rewards = contracts.rewards;
        user = contracts.user;

        [owner] = await ethers.getSigners();
    });

    it("Should register a new user", async function () {
        const firstName = "John";
        const lastName = "Doe";
        const userRegistration = await user.registerUser(firstName, lastName);
        const tokenId = await userRegistration.wait();

        expect(tokenId).to.not.equal(0);
        expect(await user.userExists(owner.address)).to.equal(true);
    });

    it("Should not allow a user to register twice", async function () {
        const firstName = "John";
        const lastName = "Doe";
        await user.registerUser(firstName, lastName);
    
        expect(await user.userExists(owner.address)).to.equal(true);
    
        await expect(user.registerUser(firstName, lastName)).to.be.revertedWith("User is already registered");
      });

    it("Should return false for non-existent users", async function () {
        expect(await user.userExists(owner.address)).to.equal(false);
    });
});