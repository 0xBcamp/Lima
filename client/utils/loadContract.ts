import { ethers } from "ethers";
import fs from "fs";
import path from "path";

export const loadContractData = (contractName: string) => {
    const filePath = path.join(process.cwd(), `../artifacts/contracts/${contractName}.sol`, `${contractName}.json`);
    console.log('filePath :>> ', filePath);
    const json = fs.readFileSync(filePath, "utf-8");
    const deploymentData = JSON.parse(json);

    return deploymentData;
  }

//   export async function loadContractData(contractName: string, signer: any) {
//     const filePath = path.join(process.cwd(), "../../deployments/localhost", `${contractName}.json`);
//     console.log('filePath :>> ', filePath);
//     // const json = fs.readFileSync(filePath, "utf-8");
//     // const deploymentData = JSON.parse(json);
  
//     // const contract = new ethers.Contract(deploymentData.address, deploymentData.abi, signer);
//     // return contract;
//   }  