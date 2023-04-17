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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { openSidePanel } from '../../../store/slices/sidePanelSlice';
import { PanelsEnum } from '@/enums/PanelsEnum';

const ViewPropertyPanel = () => {
    const { provider } = useContext(EthersContext);

    const dispatch = useAppDispatch();

    const blockchain = useAppSelector((state) => state.blockchain);
    const selectedProperty = useAppSelector((state) => state.navigation.selectedProperty);

    const [isBusyResetting, setIsBusyResetting] = useState(false);

    const generateRandomNumber = () => {
        return Math.floor(Math.random() * 150);
    };

    return (
        <>
            {selectedProperty && <div className='flex flex-col'>
                <div className="w-full">
                    <img
                        src={`/properties/${selectedProperty.imageId ? selectedProperty.imageId : '0'}.avif`}
                        alt={selectedProperty.name}
                        className="w-full h-auto object-cover"
                    />
                    <div className='px-1 text-lg font-bold pt-1'>{selectedProperty.name}</div>
                    <div className='px-1 text-sm'>{selectedProperty.location}</div>
                    <div className='font-bold px-1 text-sm pb-2 pt-1 grow'>
                        <FontAwesomeIcon icon={faStar} className='text-yellow-500' />
                        <FontAwesomeIcon icon={faStar} className='text-yellow-500' />
                        <FontAwesomeIcon icon={faStar} className='text-yellow-500' />
                        <FontAwesomeIcon icon={faStar} className='text-yellow-500' />
                        <FontAwesomeIcon icon={faStarHalfStroke} className='text-yellow-500' />
                    </div>
                    
                    <div className='px-1 text-md font-bold pt-4'>
                        Overview
                    </div>
                    {/* <hr className="border-t border-gray-300 mb-4 mt-2" /> */}
                    <div className='px-1 text-sm'>
                        {selectedProperty.description.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                    </div>
                    <div className='px-1 text-md font-bold pt-4'>
                        Rates
                    </div>
                    <div className='px-1 text-sm'>
                        ${selectedProperty.pricePerNight} per night
                    </div>
                    <div className='px-1 text-sm pt-4'>
                        <FC_Button text='Make a Booking' customClassName='w-full text-bold' onClick={() => {
                            dispatch(openSidePanel({
                                title: `Create booking (${selectedProperty.name})`,
                                contentComponent: PanelsEnum.CreateBookingPanel,
                                sourceId: `OverviewPage`
                            }));
                        }} />
                    </div>
                </div>
            </div>}
        </>

    );
};

export default ViewPropertyPanel;