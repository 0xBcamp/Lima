import { JsonRpcProvider } from "ethers";
import { createContext } from "react";

interface EthersContextType {
    provider: JsonRpcProvider | null;
  }
  
  const EthersContext = createContext<EthersContextType>({
    provider: null,
  });

export default EthersContext;