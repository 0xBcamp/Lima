import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

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
});