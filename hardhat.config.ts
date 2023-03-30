import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "hardhat-deploy-ethers";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      saveDeployments: true,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};

export default config;
