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
import { IUser } from '../../../models/user';
import { getUser } from '../../../services/userService';
import { IProperty } from '../../../models/property';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { getRewards } from '../../../services/rewardsService';
import { ethers } from 'ethers';
import { unixTimestampToLocalTime } from '../../../utils/timeUtils';
import { IBooking } from '../../../models/booking';

interface IBookingReceived {
    user: IUser;
    booking: IBooking;
    property: IProperty;
}

const ViewUserPanel = () => {
    const { provider } = useContext(EthersContext);

    const dispatch = useAppDispatch();

    const selectedAccount = useAppSelector((state) => state.account.selectedAccount);
    const blockNumber = useAppSelector((state) => state.blockchain.blockNumber);
    const usdcContract = useAppSelector((state) => state.solContract.contracts?.find(x => x.name === "DummyUSDC"));
    const rewardsContract = useAppSelector((state) => state.solContract.contracts?.find(x => x.name === "Rewards"));


    const [user, setUser] = useState<IUser>();
    const [userRewardPoint, setUserRewardPoint] = useState<number>(0);
    const [allRewardPoint, setAllRewardPoint] = useState<number>(0);

    const [userRewardsUSDC, setUserRewardsUSDC] = useState<string>("0.0");
    const [bookingsReceived, setBookingsReceived] = useState<IBookingReceived[]>([]);
    const [userUSDCbalance, setUseruserUSDCbalance] = useState<string>("0.0");

    useEffect(() => {
        if (selectedAccount) {
            (async () => {
                setUser(await getUser(selectedAccount.address));
            })();
        }
    }, [selectedAccount?.address, blockNumber]);

    useEffect(() => {
        if (user && rewardsContract) {
            const userBookingsReceived: IBookingReceived[] = [];
            if (user.properties && user.properties?.length > 0) {
                user.properties.forEach((property: any) => {
                    if (property.bookings && property.bookings?.length > 0) {
                        property.bookings.forEach((booking: any) => {
                            const newBookingReceived: IBookingReceived = {
                                user: booking.user,
                                property: property,
                                booking: booking
                            }
                            userBookingsReceived.push(newBookingReceived);
                        });
                    }
                });
                setBookingsReceived(userBookingsReceived);
            }



            (async () => {
                const balance = await getUSDCBalance(user.owner);
                setUseruserUSDCbalance(balance ? balance : "0.0");
                
                const rewards = await getRewards();
                console.log('rewards :>> ', rewards);
                const totalPoints = rewards.reduce((accumulator, reward) => {
                    return accumulator + reward.points;
                }, 0);
                setAllRewardPoint(totalPoints);

                if (user.rewards) {
                    const userPoints = user.rewards.reduce((accumulator, reward) => {
                        return accumulator + (reward as any).points;
                    }, 0);
                    setUserRewardPoint(userPoints);

                    const balance = await getUSDCBalance(rewardsContract.address);
                    console.log('balance :>> ', balance);
                    const percentage = ((userPoints / totalPoints) * (+(balance ? balance : 0))).toFixed(2);
                    setUserRewardsUSDC(percentage);
                }



            })();
        }
    }, [user])

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

    console.log('user :>> ', user);

    return (
        <>
            {!user && <div className='flex justify-center items-center mt-20 text-xl'>User not found</div>}
            {user && <div className='flex flex-col'>
                <div className='flex space-x-4 border-b-2 border-gray-100 p-2'>
                    <div>
                        <img
                            src={`https://xsgames.co/randomusers/assets/avatars/${user.gender}/${user.imageId}.jpg`}
                            alt="My Image Description"
                            className='h-16 w-16 rounded-full shadow-2xl'
                        /></div>
                    <div className='my-auto text-xl'>
                        <div>{user.firstName} {user.lastName}</div>
                        <div className='text-sm'>${userUSDCbalance}</div>
                    </div>
                </div>
                <div className='flex flex-col border-b-2 border-gray-100 p-2'>
                    <div className='font-semibold'>Properties</div>
                    {!user.properties || user.properties?.length === 0 && <div className='text-sm font-light pt-2'>You have no properties</div>}
                    {user.properties && user.properties?.length > 0 &&
                        user.properties.map(((property, index) => {
                            return (
                                <div key={index} className='flex my-1'>
                                    <div>
                                        <img
                                            src={`/properties/${(property as any).imageId ? (property as any).imageId : '0'}.avif`}
                                            alt={(property as any).name}
                                            className="w-32 object-cover"
                                        />
                                    </div>
                                    <div className='flex flex-col text-sm px-2'>
                                        <div className='font-bold pb-1'>{(property as any).name}</div>
                                        <div className='font-bold text-sm'>
                                            <FontAwesomeIcon icon={faStar} className='text-yellow-500' />
                                            <FontAwesomeIcon icon={faStar} className='text-yellow-500' />
                                            <FontAwesomeIcon icon={faStar} className='text-yellow-500' />
                                            <FontAwesomeIcon icon={faStar} className='text-yellow-500' />
                                            <FontAwesomeIcon icon={faStarHalfStroke} className='text-yellow-500' />
                                        </div>
                                        <div className=''>${(property as any).pricePerNight} per night</div>
                                        <div className=''>{(property as any).bookings.length} bookings</div>
                                    </div>

                                </div>
                            )
                        }))
                    }
                </div>
                {user.properties && user.properties?.length > 0 && <div className='flex flex-col border-b-2 border-gray-100 p-2'>
                    <div className='font-semibold'>Bookings received</div>
                    {bookingsReceived?.length === 0 && <div className='text-sm font-light pt-2'>You have recieved no bookings yet</div>}
                    {bookingsReceived?.length > 0 && <div className='text-sm font-light pt-2'>
                        {
                            bookingsReceived.map(((booking, index) => {
                                return (
                                    <div key={index} className='flex my-1'>
                                        <div className='my-auto'>
                                            <img
                                                src={`https://xsgames.co/randomusers/assets/avatars/${booking.user.gender}/${booking.user.imageId}.jpg`}
                                                alt={booking.user.firstName}
                                                className="h-16 w-16 rounded-full shadow-2xl"
                                            />
                                        </div>
                                        <div className='flex flex-col text-sm px-2'>
                                            <div className='font-bold'>{booking.property.name}</div>
                                            <div className='font-bold'>{booking.user.firstName} {booking.user.lastName}</div>
                                            <div className='text-sm'>Dates: {unixTimestampToLocalTime(+booking.booking.startDate, true)} - {unixTimestampToLocalTime(+booking.booking.endDate, true)}</div>
                                            <div className='text-sm'>Paid: ${ethers.formatEther(booking.booking.totalPrice)}</div>
                                        </div>
                                    </div>
                                )
                            }))}
                    </div>}
                </div>}
                <div className='flex flex-col border-b-2 border-gray-100 p-2'>
                    <div className='font-semibold'>Bookings made</div>
                    {!user.bookings || user.bookings.length === 0 && <div className='text-sm font-light pt-2'>You have made no bookings yet</div>}
                    {user.bookings && user.bookings.length > 0 && <div className='text-sm font-light pt-2'>
                        {
                            user.bookings.map(((booking, index) => {
                                return (
                                    <div key={index} className='flex my-1'>
                                        <div>
                                            <img
                                                src={`/properties/${(booking as any).property.imageId ? (booking as any).property.imageId : '0'}.avif`}
                                                alt={(booking as any).property.name}
                                                className="w-24 object-cover"
                                            />
                                        </div>
                                        <div className='flex flex-col text-sm px-2'>
                                            <div className='font-bold'>{(booking as any).property.name}</div>
                                            <div className='text-sm'>Dates: {unixTimestampToLocalTime((booking as any).startDate, true)} - {unixTimestampToLocalTime((booking as any).endDate, true)}</div>
                                            <div className='text-sm'>Paid: ${ethers.formatEther((booking as any).totalPrice)}</div>
                                        </div>
                                    </div>
                                )
                            }))
                        }
                    </div>}
                </div>
                <div className='flex flex-col border-b-2 border-gray-100 p-2'>
                    <div className='font-semibold'>Rewards</div>
                    {!user.rewards || user.rewards?.length === 0 && <div className='text-sm font-light pt-2'>You have no rewards</div>}
                    {user.rewards && user.rewards?.length > 0 && <div className='text-sm pt-2'>You have {userRewardPoint} out of {allRewardPoint} points ({(userRewardPoint / allRewardPoint * 100).toFixed(2)}%)</div>}
                    {user.rewards && user.rewards?.length > 0 && <div className='text-sm pt-2'>Pending rewards: <span className='font-bold'>${userRewardsUSDC}</span></div>}
                </div>
            </div>}
        </>

    );
};

export default ViewUserPanel;