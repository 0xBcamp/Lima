import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { TopNav } from '@/components/navigation/TopNav';
import { Provider } from 'react-redux';
import store from '../../store/store';
import { ethers } from 'ethers';
import EthersContext from '../../context/EthersContext';
import { ContractBar } from '@/components/ContractBar';

const jsonRpcProvider = new ethers.JsonRpcProvider(process.env.RPC_URL);

export default function App({ Component, pageProps }: AppProps) {

  return (
    <Provider store={store}>
      <EthersContext.Provider value={jsonRpcProvider}>
        <TopNav />
        <ContractBar />
        <Component {...pageProps} />
      </EthersContext.Provider>
    </Provider>
  );
}
