import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

describe("User", function () {
    let user: Contract;

    beforeEach(async () => {
        const User = await ethers.getContractFactory("User");
        user = await User.deploy();
        await user.deployed();
    });

    it("Should register a new user", async function () {
        const firstName = "John";
        const lastName = "Doe";
        const userRegistration = await user.registerUser(firstName, lastName);
        const tokenId = await userRegistration.wait();

        expect(tokenId).to.not.equal(0);
        expect(await user.userExists()).to.equal(true);
    });

    it("Should not allow a user to register twice", async function () {
        const firstName = "John";
        const lastName = "Doe";
        await user.registerUser(firstName, lastName);
    
        expect(await user.userExists()).to.equal(true);
    
        await expect(user.registerUser(firstName, lastName)).to.be.revertedWith("User is already registered");
      });

    it("Should return false for non-existent users", async function () {
        expect(await user.userExists()).to.equal(false);
    });
});