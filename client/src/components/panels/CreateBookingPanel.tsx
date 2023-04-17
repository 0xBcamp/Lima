// Import the required dependencies
import React, { useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setSelectedAccount } from '../../../store/slices/accountSlice';
import SidePanel from '../SidePanel';
import Image from 'next/image';
import defaultProfilePicture from '../../../public/profile.jpg';
import EthersContext from '../../../context/EthersContext';
import { FC_Button } from '../form-controls/FC_Button';
import { reset } from '../../../services/appService';
import { Spinner } from '../Spinner';
import { FC_Input } from '../form-controls/FC_Input';
import { IDummyPropertyForm } from '../../../models/dummyProperty';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faStar, faStarHalf, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons';
import DatePicker from "react-datepicker";
import { ethers } from 'ethers';
import { addDays, getStayDates, unixTimestampToLocalTime } from '../../../utils/timeUtils';
import { getUser } from '../../../services/userService';
import { IUser } from '../../../models/user';
import { closeSidePanel, openSidePanel } from '../../../store/slices/sidePanelSlice';
import { PanelsEnum } from '@/enums/PanelsEnum';
import { toast } from 'react-toastify';

const CreateBookingPanel = () => {
    const { provider } = useContext(EthersContext);

    const selectedAccount = useAppSelector((state) => state.account.selectedAccount);

    const selectedProperty = useAppSelector((state) => state.navigation.selectedProperty);
    const propertyContract = useAppSelector((state) => state.solContract.contracts?.find(x => x.name === "Property"));
    const bookingsContract = useAppSelector((state) => state.solContract.contracts?.find(x => x.name === "Booking"));
    const usdcContract = useAppSelector((state) => state.solContract.contracts?.find(x => x.name === "DummyUSDC"));

    const dispatch = useAppDispatch();

    const [wallet, setWallet] = useState<ethers.Wallet>();

    const [checkInDate, setCheckInDate] = useState<number>(new Date().getTime() / 1000);
    const [checkOutDate, setCheckOutDate] = useState<number>(addDays(new Date().getTime(), 3));

    const [checkinNightCount, setCheckinNightCount] = useState<number>(getStayDates(checkInDate, checkOutDate));

    const [bookingFees, setBookingFees] = useState<number>(0);
    const [platformFees, setPlatformFees] = useState<number>(0);
    const [totalFees, setTotalFees] = useState<number>(0);

    const [userAllowance, setUserAllowance] = useState("0");
    const [userBalance, setUserBalance] = useState("0");

    const [isBusy, setIsBusy] = useState(false);
    const [user, setUser] = useState<IUser>();

    useEffect(() => {
        if (selectedAccount) {
            (async () => {
                setUser(await getUser(selectedAccount.address));
            })();
        }
    }, [selectedAccount?.address])

    useEffect(() => {
        if (selectedAccount && usdcContract && bookingsContract) {
            (async () => {
                setWallet(new ethers.Wallet(selectedAccount.privateKey, provider));
                const contract = new ethers.Contract(usdcContract.address, usdcContract.abi, provider);

                setUserAllowance(ethers.formatEther(await contract.allowance(selectedAccount.address, bookingsContract.address)));
                setUserBalance(ethers.formatEther(await contract.balanceOf(selectedAccount.address)));
            })()

        }
    }, [selectedAccount?.address, usdcContract, bookingsContract]);

    useEffect(() => {
        if (checkOutDate < checkInDate) {
            setCheckOutDate(addDays(new Date(checkInDate * 1000).getTime(), 3));
            return
        }
        if (checkInDate && checkOutDate) {
            setCheckinNightCount(getStayDates(checkInDate, checkOutDate))
        }
    }, [checkInDate, checkOutDate]);

    useEffect(() => {
        (async () => {
            if (selectedProperty && usdcContract && selectedAccount && bookingsContract) {
                const booking = selectedProperty?.pricePerNight * checkinNightCount;
                const platform = booking * 0.05;
                setBookingFees(booking);
                setPlatformFees(platform);
                setTotalFees(booking + platform);

                const contract = new ethers.Contract(usdcContract.address, usdcContract.abi, provider);
                setUserAllowance(ethers.formatEther(await contract.allowance(selectedAccount.address, bookingsContract.address)));
            }
        })();


    }, [checkinNightCount]);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        if (name === 'checkIn') setCheckInDate(value);
        if (name === 'checkOut') setCheckOutDate(value);
    };

    const onCreate = async () => {

        if (!isBookingValid()) {
            return;
        }
        
        if (bookingsContract && selectedProperty) {
            try {
                setIsBusy(true);
                const contract = new ethers.Contract(bookingsContract.address, bookingsContract.abi, wallet);
    
                console.log('selectedProperty?.propertyId :>> ', selectedProperty.propertyId, checkInDate, checkOutDate);
                // Step 1: Call the contract function and receive the transaction response.
                const txResponse = await (contract as any).createBooking(selectedProperty?.propertyId, checkInDate, checkOutDate);
    
                // Step 2: Wait for the transaction to be mined.
                const txReceipt = await txResponse.wait(5);
                setIsBusy(false);
                toast.success('Booking successfuly created');
                dispatch(closeSidePanel({ contentComponent: PanelsEnum.CreateBookingPanel }));
                dispatch(closeSidePanel({ contentComponent: PanelsEnum.ViewPropertyPanel }));
                if (user) {
                    dispatch(openSidePanel({
                        title: `${user.firstName} ${user.lastName}`,
                        contentComponent: PanelsEnum.ViewUserPanel,
                        sourceId: `OverviewPage`
                    }));
                }
            } catch (error: any) {
                toast.error('An error occured', error.toString());
                setIsBusy(false);
            }

        }

    };

    const onApprove = async () => {
        if (usdcContract && bookingsContract && selectedAccount) {
            try {
                setIsBusy(true);
                const tempWallet = new ethers.Wallet(selectedAccount.privateKey, provider)
                const contract = new ethers.Contract(usdcContract.address, usdcContract.abi, wallet);
                const amountWithDecimals = ethers.parseUnits(totalFees.toString(), 18);
                // Step 1: Call the contract function and receive the transaction response.
                const txResponse = await (contract as any).approve(bookingsContract.address, amountWithDecimals);
                const txReceipt = await txResponse.wait(5);
    
                const allow = ethers.formatEther(await contract.allowance(selectedAccount.address, bookingsContract.address));
    
                setUserAllowance(allow);
                setIsBusy(false);
                toast.success('Approval suuccessful');
            } catch (error) {
                toast.error('An error occured');
                setIsBusy(false);
            }
        }

    };

    const isBookingValid = () => {
        if (totalFees > +userBalance) {
            return false;
        }

        return true
    }

    return (
        <>
            {selectedProperty &&
                <div className='flex flex-col'>
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
                        Choose your stay dates - {checkinNightCount} nights
                    </div>
                    <hr className="border-t border-gray-300 mb-4 mt-2" />
                    <div className='flex space-x-4 px-1'>

                        <DatePicker selected={new Date(checkInDate * 1000)} onChange={(date) => setCheckInDate(date ? date.getTime() / 1000 : new Date().getTime())} customInput={
                            <button>
                                <FC_Input
                                    label='Check in'
                                    value={checkInDate ? unixTimestampToLocalTime(checkInDate, true) : checkInDate}
                                    onChange={handleInputChange}
                                    name='checkIn'
                                    placeholder='Check in'
                                    customClassName='mb-4'
                                    icon={faCalendarAlt}
                                />
                            </button>
                        } />
                        <DatePicker selected={new Date(checkOutDate * 1000)} onChange={(date) => setCheckOutDate(date ? date.getTime() / 1000 : new Date().getTime())} customInput={
                            <button>
                                <FC_Input
                                    label='Check out'
                                    value={checkOutDate ? unixTimestampToLocalTime(checkOutDate, true) : checkOutDate}
                                    onChange={handleInputChange}
                                    name='checkOut'
                                    placeholder='Check out'
                                    customClassName='mb-4'
                                    icon={faCalendarAlt}
                                />
                            </button>
                        } />
                    </div>

                    <div className='px-1 text-md font-bold pt-4'>
                        Price
                    </div>
                    <hr className="border-t border-gray-300 mb-4 mt-2" />
                    <div className='flex text-sm'>
                        <div className='grow text-right font-semibold pr-4'>Booking fees</div>
                        <div className=''>USDC {bookingFees}</div>
                    </div>
                    <div className='flex text-sm'>
                        <div className='grow text-right font-semibold pr-4'>Platform fees</div>
                        <div className=''>USDC {platformFees}</div>
                    </div>
                    <div className='flex text-sm font-bold mt-2'>
                        <div className='grow text-right pr-4'>Total</div>
                        <div className=''>USDC {totalFees}</div>
                    </div>
                    {totalFees > 0 && totalFees > +userBalance && <div className='flex text-sm mt-2'>
                        <div className='grow text-right text-red-500'>You have insufficient funds</div>
                    </div>}
                    {+userAllowance >= totalFees && user && !isBusy && <div className='text-right mt-2'>
                        <FC_Button disabled={!isBookingValid()} text='Book now' type='button' onClick={onCreate}></FC_Button>
                    </div>}
                    {+userAllowance < totalFees && !isBusy && user && <div className='text-right mt-2'>
                        <FC_Button text='Approve' type='button' onClick={onApprove}></FC_Button>
                    </div>}
                    {!user && <div className='text-right mt-2'>
                        <FC_Button text='Create account' type='button' onClick={() => {
                            dispatch(openSidePanel({
                                title: 'Register user',
                                contentComponent: PanelsEnum.RegisterUserPanel,
                                sourceId: `CreateBooking`
                            }))
                        }}></FC_Button>
                    </div>}
                    {isBusy &&
                        <div className='flex justify-end pt-2 pr-2'>
                            <Spinner />
                        </div>
                    }

                </div>}
        </>
    );
};

export default CreateBookingPanel;