import axios from "axios";
import { ethers } from "hardhat";

async function main() {
  const apiUrl = "http://localhost:3000";

  const solContracts = (await axios.get(`${apiUrl}/api/contracts`)).data;

  // Use the Hardhat provider to get signer accounts
  const accounts = await ethers.getSigners();

  console.log('starting script....');

  const users = [
    {firstName: "Oliver", lastName: "Thompson", owner: accounts[1].address, gender: "male", imageId: 1 },
    {firstName: "Isabelle", lastName: "Johnson", owner: accounts[2].address, gender: "female", imageId: 2 },
  ]

  // Sequentially register the users
  for (const user of users) {
    try {
      console.log('user :>> ', user);
      const signer = accounts.find(x => x.address === user.owner);
      const newUser = (await axios.post(`${apiUrl}/api/users`, user)).data;
      const userContract = solContracts.find((x: any) => x.name === "User");
      const deployedUserContract = new ethers.Contract(userContract.address, userContract.abi, signer);
  
      const txResponse = await deployedUserContract.registerUser(newUser._id.toString());
      await txResponse.wait();
    } catch (error) {
      console.log('error :>> ', error);
    }

  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });