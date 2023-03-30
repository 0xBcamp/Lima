import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../utils/dbConnect';
import { Account, IAccount } from '../../../models/account';
import { loadContractData } from '../../../utils/loadContract';
import { SolContract } from '../../../models/solContract';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  const contractNames = ["User"];
  const deployedContracts: any[] = [];

  if (req.method === 'GET') {

    contractNames.forEach(contract => {
      const data = loadContractData(contract);
      deployedContracts.push({
        name: contract,
        address: data.address,
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