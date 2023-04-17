import { ethers } from "ethers";
import fs from "fs";
import path from "path";

export const loadContractData = (contractName: string) => {
    const filePath = path.join(process.cwd(), `../artifacts/contracts/${contractName}.sol`, `${contractName}.json`);
    const json = fs.readFileSync(filePath, "utf-8");
    const deploymentData = JSON.parse(json);

    return deploymentData;
  }