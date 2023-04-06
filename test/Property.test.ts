import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Property", function () {
    let property: Contract;
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;

    beforeEach(async () => {
        const Property = await ethers.getContractFactory("Property");
        [owner, addr1, addr2] = await ethers.getSigners();
        property = await Property.deploy();
        await property.deployed();
    });

    describe('registerProperty', async () => {
        it('Should create a new property and emit PropertyRegistered event', async function () {
          const tx = await property.connect(owner).registerProperty(
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
              'New York',
              'USA',
              'https://example.com/property/1',
              200
            );
    
          const propertyInfo = await property.getPropertyInfo(1);
    
          expect(propertyInfo.propertyId).to.equal(1);
          expect(propertyInfo.owner).to.equal(owner.address);
          expect(propertyInfo.location).to.equal('New York');
          expect(propertyInfo.country).to.equal('USA');
          expect(propertyInfo.uri).to.equal('https://example.com/property/1');
          expect(propertyInfo.pricePerNight).to.equal(200);
        });
      });
});