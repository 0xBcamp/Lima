// Import the required dependencies
import useLoadAppData from '@/hooks/useLoadAppData';
import { ethers } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';
import EthersContext from '../../../context/EthersContext';
import { useAppSelector } from '../../../store/hooks';
import { unixTimestampToLocalTime } from '../../../utils/timeUtils';
import AccountsPanel from '../panels/AccountsPanel';
import BlockchainPanel from '../panels/BlockchainPanel';

export const TopNav = () => {
    const { provider } = useContext(EthersContext);
    useLoadAppData();

    const selectedAccount = useAppSelector((state) => state.account.selectedAccount);
    const blockchain = useAppSelector((state) => state.blockchain);
    console.log('blockchain :>> ', blockchain);

    const [isAccountsPanelOpen, setIsAccountsPanelOpen] = useState(false);
    const [isBlockchainPanelOpen, setIsBlockchainPanelOpen] = useState(false);

    const [accountBalance, setAccountBalance] = useState("0");

    useEffect(() => {
        (async () => {
            if (provider && selectedAccount) {
                const checksumAddress = ethers.getAddress(selectedAccount.address);
                const balance = await provider.getBalance(checksumAddress.toLowerCase());
                setAccountBalance(ethers.formatEther(balance));
            }
        })()
    }, [selectedAccount])

    return (
        <>
            {isAccountsPanelOpen && <AccountsPanel isOpen={isAccountsPanelOpen} onClose={() => setIsAccountsPanelOpen(false)}></AccountsPanel>}
            {isBlockchainPanelOpen && <BlockchainPanel isOpen={isBlockchainPanelOpen} onClose={() => setIsBlockchainPanelOpen(false)}></BlockchainPanel>}

            <nav className="bg-blue-500">
                <div className="mx-auto flex items-center justify-between text-white">
                    <div className=" font-bold text-xl p-2">
                        HomeChain
                    </div>
                    <ul className="flex items-center space-x-4">
                        {/* <li>
                            <a href="/" className="text-white">
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-white">
                                Create
                            </a>
                        </li> */}
                        <li>
                            <div className="p-2 flex flex-col">
                                <div className='text-center'>Date</div>
                                <div className='text-sm text-center'>{`${(blockchain?.blockTimestamp || blockchain?.blockTimestamp === 0) ? unixTimestampToLocalTime(blockchain.blockTimestamp) : "-"}`}</div>
                            </div>
                        </li>
                        <li>
                            <div onClick={() => setIsBlockchainPanelOpen(true)} className="p-2 flex flex-col hover:cursor-pointer hover:bg-blue-400">
                                <div className='text-center'>Block Number</div>
                                <div className='text-sm text-center'>{`${(blockchain?.blockNumber || blockchain?.blockNumber === 0) ? blockchain.blockNumber : "-"}`}</div>
                            </div>
                        </li>
                        <li>
                            <div onClick={() => setIsAccountsPanelOpen(true)} className="p-2 flex flex-col hover:cursor-pointer hover:bg-blue-400">
                                <div>{selectedAccount?.name}</div>
                                <div className='text-sm text-center'>{accountBalance}</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </>

    );
};

