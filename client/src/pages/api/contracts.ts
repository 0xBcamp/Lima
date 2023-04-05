import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../utils/dbConnect';
import { Account, IAccount } from '../../../models/account';
import { loadContractData } from '../../../utils/loadContract';
import { SolContract } from '../../../models/solContract';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  const initContractNames = [
    {name: "User", address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"}, 
    {name: "Property", address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"}, 
    {name: "Rewards", address: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"}, 
    {name: "Escrow", address: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"}, 
    {name: "Booking", address: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"}, 
    {name: "Messaging", address: "0x0165878A594ca255338adfa4d48449f69242Eb8F"}, 
    {name: "Review", address: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"}, 
    {name: "DummyUSDC", address: "0x5FbDB2315678afecb367f032d93F642f64180aa3"}, 
];
  const deployedContracts: any[] = [];

  if (req.method === 'GET') {
    console.log("get contracts");
    
    initContractNames.forEach(contract => {
      const data = loadContractData(contract.name);
      
      deployedContracts.push({
        name: contract.name,
        address: contract.address,
        abi: data.abi
      });
    });

    await SolContract.deleteMany({});
    await SolContract.insertMany(deployedContracts);
    const contracts = await SolContract.find({});


    return res.status(200).json(contracts);
  }

  // Handle other request methods
  res.status(405).json({ error: 'Method not allowed' });
}