// Import the required dependencies
import React, { useContext } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setSelectedAccount } from '../../../store/slices/accountSlice';
import SidePanel from '../SidePanel';
import Image from 'next/image';
import defaultProfilePicture from '../../../public/profile.jpg';
import EthersContext from '../../../context/EthersContext';

interface BlockchainPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const BlockchainPanel = ({ isOpen, onClose }: BlockchainPanelProps) => {
    const { provider } = useContext(EthersContext);
    
    const dispatch = useAppDispatch();

    const blockchain = useAppSelector((state) => state.blockchain);

    return (
        <SidePanel isOpen={isOpen} onClose={onClose} title="Blockchain">
            <div className='flex flex-col'>
                <div className='flex'>
                    <div className='grow'>Mine blocks</div>
                    <div><input /></div>
                    <button onClick={async () => {
                        await provider?.send("evm_mine", []);
                    }}>Mine</button>
                </div>
                <div className='flex'>
                    <div className='grow'>Block number</div>
                    <div>{blockchain.blockNumber}</div>
                </div>
            </div>
        </SidePanel>

    );
};

export default BlockchainPanel;