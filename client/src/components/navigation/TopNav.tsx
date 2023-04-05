import useLoadAppData from '@/hooks/useLoadAppData';
import { ethers } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';
import EthersContext from '../../../context/EthersContext';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { unixTimestampToLocalTime } from '../../../utils/timeUtils';
import { closeSidePanel, openSidePanel } from '../../../store/slices/sidePanelSlice';
import { PanelsEnum } from '@/enums/PanelsEnum';
import { setSelectedAccount } from '../../../store/slices/accountSlice';
import useContractEvents from '@/hooks/useContractEvents';

export const TopNav = () => {
    const dispatch = useAppDispatch();
    
    const { provider } = useContext(EthersContext);
    useLoadAppData();
    useContractEvents();

    const selectedAccount = useAppSelector((state) => state.account.selectedAccount);
    const blockchain = useAppSelector((state) => state.blockchain);
    const panelSelectedAccount = useAppSelector((state) => state.sidePanel.panels?.find(x => x.contentComponent === PanelsEnum.AccountsPanel));

    const [accountBalance, setAccountBalance] = useState("0");

    useEffect(() => {
        if (panelSelectedAccount?.selectedAccount && panelSelectedAccount.sourceId === "TopNav") {
            dispatch(setSelectedAccount(panelSelectedAccount?.selectedAccount));
            dispatch(closeSidePanel({ contentComponent: PanelsEnum.AccountsPanel }));
        }
    }, [panelSelectedAccount?.selectedAccount]);
    
    useEffect(() => {
        (async () => {
            if (provider && selectedAccount) {
                const checksumAddress = ethers.getAddress(selectedAccount.address);
                const balance = await provider.getBalance(checksumAddress.toLowerCase());
                setAccountBalance(ethers.formatEther(balance));
            }
        })()
    }, [selectedAccount]);

    return (
        <>
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
                            <div onClick={() => console.log("TODO: Open blockchain panel")} className="p-2 flex flex-col hover:cursor-pointer hover:bg-blue-400">
                                <div className='text-center'>Block Number</div>
                                <div className='text-sm text-center'>{`${(blockchain?.blockNumber || blockchain?.blockNumber === 0) ? blockchain.blockNumber : "-"}`}</div>
                            </div>
                        </li>
                        <li>
                            <div onClick={() => {
                                dispatch(openSidePanel({
                                    title: 'Accounts',
                                    contentComponent: PanelsEnum.AccountsPanel,
                                    sourceId: `TopNav`
                                }));
                            }} className="p-2 flex flex-col hover:cursor-pointer hover:bg-blue-400">
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

