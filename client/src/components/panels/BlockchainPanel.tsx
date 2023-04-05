// Import the required dependencies
import React, { useContext } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setSelectedAccount } from '../../../store/slices/accountSlice';
import SidePanel from '../SidePanel';
import Image from 'next/image';
import defaultProfilePicture from '../../../public/profile.jpg';
import EthersContext from '../../../context/EthersContext';

const BlockchainPanel = () => {
    const { provider } = useContext(EthersContext);
    
    const dispatch = useAppDispatch();

    const blockchain = useAppSelector((state) => state.blockchain);

    return (
        <div>BlockchainPanel</div>
        // <SidePanel isOpen={isOpen} onClose={onClose} title="Blockchain">
        //     <div className='flex flex-col'>
        //         <div className='flex'>
        //             <div className='grow'>Mine blocks</div>
        //             <div><input /></div>
        //             <button onClick={async () => {
        //                 await provider?.send("evm_mine", []);
        //             }}>Mine</button>
        //         </div>
        //         <div className='flex'>
        //             <div className='grow'>Block number</div>
        //             <div>{blockchain.blockNumber}</div>
        //         </div>
        //     </div>
        // </SidePanel>

    );
};

export default BlockchainPanel;