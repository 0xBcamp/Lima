import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { TopNav } from '@/components/navigation/TopNav';
import { Provider } from 'react-redux';
import store from '../../store/store';
import { ethers } from 'ethers';
import EthersContext from '../../context/EthersContext';
import { SubNavBar } from '@/components/navigation/SubNavBar';
import { AbiFunctions } from '@/components/abi/AbiFunctions';
import { AbiEvents } from '@/components/abi/AbiEvents';
import SidePanel from '@/components/SidePanel';
import '@fortawesome/fontawesome-svg-core/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const jsonRpcProvider = new ethers.JsonRpcProvider(process.env.RPC_URL);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <EthersContext.Provider value={jsonRpcProvider}>
          <TopNav />
          <SubNavBar />
          <div className='flex'>
            <div className="w-3/5"><Component {...pageProps} /></div>
            <div className="w-1/5">
              <AbiFunctions />
            </div>
            <div className="w-1/5">
              <AbiEvents />
            </div>
          </div>
          <SidePanel />
          <ToastContainer position={toast.POSITION.TOP_CENTER}/>
      </EthersContext.Provider>
    </Provider>
  );
}
