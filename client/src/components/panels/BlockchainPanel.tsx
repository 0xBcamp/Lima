// Import the required dependencies
import React, { useContext, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setSelectedAccount } from '../../../store/slices/accountSlice';
import SidePanel from '../SidePanel';
import Image from 'next/image';
import defaultProfilePicture from '../../../public/profile.jpg';
import EthersContext from '../../../context/EthersContext';
import { FC_Button } from '../form-controls/FC_Button';
import { reset } from '../../../services/appService';
import { Spinner } from '../Spinner';

const BlockchainPanel = () => {
    const { provider } = useContext(EthersContext);

    const dispatch = useAppDispatch();

    const blockchain = useAppSelector((state) => state.blockchain);

    const [isBusyResetting, setIsBusyResetting] = useState(false);

    return (
        <div className='flex flex-col'>
            <div className='flex'>
                <FC_Button
                    disabled={isBusyResetting}
                    text='Reset'
                    customClassName='bg-red-700 hover:bg-red-500'
                    onClick={async () => {
                        if (provider) {
                            setIsBusyResetting(true);
                            //await provider.send("hardhat_reset", []);
                            await reset();
                            setIsBusyResetting(false);
                        }
                    }}
                />
                {isBusyResetting && <div className='my-auto pl-2'><Spinner /></div>}
                
            </div>
        </div>
    );
};

export default BlockchainPanel;