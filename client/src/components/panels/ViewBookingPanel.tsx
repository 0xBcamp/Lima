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

const ViewBookingPanel = () => {
    const { provider } = useContext(EthersContext);

    const dispatch = useAppDispatch();

    const blockchain = useAppSelector((state) => state.blockchain);

    const [isBusyResetting, setIsBusyResetting] = useState(false);

    return (
        <div className='flex flex-col'>
            ViewBookingPanel
        </div>
    );
};

export default ViewBookingPanel;