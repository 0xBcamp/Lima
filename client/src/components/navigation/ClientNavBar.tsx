// Import the required dependencies
import React, { useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { Spinner } from '../Spinner';
import { setSelectedContract } from '../../../store/slices/solContractSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { closeSidePanel, openSidePanel } from '../../../store/slices/sidePanelSlice';
import { PanelsEnum } from '@/enums/PanelsEnum';
import { PagesEnum } from '@/enums/PagesEnum';
import { setPage } from '../../../store/slices/navigationSlice';
import { IUser } from '../../../models/user';
import { ethers } from 'ethers';
import EthersContext from '../../../context/EthersContext';

interface IClientNavBarProps {
    user?: IUser;
}

export const ClientNavBar = ({ user }: IClientNavBarProps) => {
    const { provider } = useContext(EthersContext);
    
    const dispatch = useAppDispatch();

    const contracts = useAppSelector((state) => state.solContract?.contracts);
    const isLoadingContracts = useAppSelector((state) => state.solContract?.isLoadingContracts);
    const selectedContract = useAppSelector((state) => state.solContract?.selectedContract);
    const panelSelectedContract = useAppSelector((state) => state.sidePanel.panels?.find(x => x.contentComponent === PanelsEnum.ContractsPanel));
    const navigationPage = useAppSelector((state) => state.navigation.page);
    const usdcContract = useAppSelector((state) => state.solContract.contracts?.find(x => x.name === "DummyUSDC"));

    const [userUSDCbalance, setUseruserUSDCbalance] = useState<string>("0.0");

    useEffect(() => {
        if (user) {
            (async () => {
                const balance = await getUSDCBalance(user.owner);
                setUseruserUSDCbalance(balance ? balance : "0.0");
            })()
        }
    }, [user]);

    useEffect(() => {
        if (panelSelectedContract?.selectedContract && panelSelectedContract.sourceId === "SubNavBar") {
            dispatch(setSelectedContract(panelSelectedContract?.selectedContract));
            dispatch(closeSidePanel({ contentComponent: PanelsEnum.ContractsPanel }));
        }
    }, [panelSelectedContract?.selectedContract]);

    const getUSDCBalance = async (userAddress: string) => {
        if (usdcContract) {
            // Connect to the ERC20 token contract
            const tokenContract = new ethers.Contract(usdcContract.address, usdcContract?.abi, provider);

            // Fetch the token balance and decimals
            const [balance, decimals] = await Promise.all([
                tokenContract.balanceOf(userAddress),
                tokenContract.decimals(),
            ]);

            // Convert the balance to a human-readable format
            return ethers.formatEther(balance);
        }

    }
    
    return (
        <>
            <nav className="bg-white border-b-2 border-gray-100">
                <div className="text-right flex ">
                    {user && <div className="p-4 hover:cursor-pointer hover:bg-blue-50 my-auto" onClick={() => {
                        dispatch(openSidePanel({
                            title: `Register Property (${user.firstName} ${user.lastName})`,
                            contentComponent: PanelsEnum.RegisterPropertyPanel,
                            sourceId: `OverviewPage`
                        }))
                    }}>Register Property</div>}
                    <div className='grow'></div>
                    {!user && <div className="p-3 hover:cursor-pointer hover:bg-blue-50 my-auto" onClick={() =>
                        dispatch(openSidePanel({
                            title: 'Register user',
                            contentComponent: PanelsEnum.RegisterUserPanel,
                            sourceId: `TopNav`
                        }))}>Create account</div>}
                    {user && <div className='p-2 flex hover:cursor-pointer hover:bg-blue-50' onClick={() => {
                        dispatch(openSidePanel({
                            title: `${user.firstName} ${user.lastName}`,
                            contentComponent: PanelsEnum.ViewUserPanel,
                            sourceId: `OverviewPage`
                        }));
                    }}>
                        <div className='flex space-x-2'>
                            <div>
                                <img
                                    src={`https://xsgames.co/randomusers/assets/avatars/${user.gender}/${user.imageId}.jpg`}
                                    alt="My Image Description"
                                    className='h-8 w-8 rounded-full shadow-2xl'
                                /></div>
                            <div className='flex flex-col'>
                                <div className='text-sm'>{user.firstName} {user.lastName}</div>
                                <div className='text-sm'>${userUSDCbalance}</div>
                            </div>
                        </div>
                    </div>}

                </div>
            </nav >
        </>

    );
};

