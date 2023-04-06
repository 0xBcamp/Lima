import { useContext, useEffect } from 'react';
import EthersContext from '../../context/EthersContext';
import { getAccounts } from '../../services/accountService';
import { getSolContracts } from '../../services/solContractService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setAccounts, setSelectedAccount } from '../../store/slices/accountSlice';
import { setBlock } from '../../store/slices/blockchainSlice';
import { setSolContracts } from '../../store/slices/solContractSlice';

const useLoadAppData = () => {

  const { provider } = useContext(EthersContext);

  const accounts = useAppSelector((state) => state.account.accounts);
  const selectedAccount = useAppSelector((state) => state.account.selectedAccount);
  const blockchain = useAppSelector((state) => state.blockchain);

  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      dispatch(setSolContracts(await getSolContracts()));
    })()
  }, []);

  useEffect(() => {
    const listenToBlocks = async () => {
      if (provider) {
        // Set initial block number
        const block = await provider.getBlock('latest');
        const blockNumber = await provider.getBlockNumber();
        dispatch(setBlock({blockNumber: blockNumber, blockTimestamp: block?.timestamp}));

        // Listen for new blocks
        provider.on('block', async (newBlockNumber) => {
          const newBlock = await provider.getBlock(newBlockNumber);
          const timestamp = newBlock?.timestamp;
          dispatch(setBlock({blockNumber: newBlockNumber, blockTimestamp: timestamp}));
        });
      }
    };

    listenToBlocks();

    // Clean up the listener when the component is unmounted
    return () => {
      if (provider) {
        provider.removeAllListeners('block');
      }
    };
  }, [provider]);

  useEffect(() => {
    (async () => {
      dispatch(setAccounts(await getAccounts()));
    })()
  }, [blockchain?.blockNumber]);

  useEffect(() => {
    if (accounts?.length > 0 && !selectedAccount) {
      dispatch(setSelectedAccount(accounts[0]))
    }
  }, [accounts]);

};

export default useLoadAppData;