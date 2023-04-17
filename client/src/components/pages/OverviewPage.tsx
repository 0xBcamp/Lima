// Import the required dependencies
import React, { useContext, useEffect, useState } from 'react';
import { IUser, IUserDto } from '../../../models/user';
import { getUsers } from '../../../services/userService';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { IProperty } from '../../../models/property';
import { IBooking } from '../../../models/booking';
import { getProperties } from '../../../services/propertyService';
import { getBookings } from '../../../services/bookingService';
import EthersContext from '../../../context/EthersContext';
import { ethers } from 'ethers';
import { IReward } from '../../../models/reward';
import { getRewards } from '../../../services/rewardsService';
import Link from 'next/link';
import { PanelsEnum } from '@/enums/PanelsEnum';
import { openSidePanel } from '../../../store/slices/sidePanelSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faCalendar, faCalendarPlus, faEye, faHouse } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '../Tooltip';
import { setSelectedProperty } from '../../../store/slices/navigationSlice';
import { SectionScrollable } from '../SectionScrollable';

export const OverviewPage = () => {
    const { provider } = useContext(EthersContext);

    const dispatch = useAppDispatch();

    const usdcContract = useAppSelector((state) => state.solContract.contracts?.find(x => x.name === "DummyUSDC"));
    const rewardsContract = useAppSelector((state) => state.solContract.contracts?.find(x => x.name === "Rewards"));
    const escrowContract = useAppSelector((state) => state.solContract.contracts?.find(x => x.name === "Escrow"));
    const lastEventAdded = useAppSelector((state) => state.evmEvent.lastEventAdded);

    const [users, setUsers] = useState<IUserDto[]>([]);
    const [properties, setProperties] = useState<IProperty[]>([]);
    const [bookings, setBookings] = useState<IBooking[]>([]);
    const [rewards, setRewards] = useState<IReward[]>([]);

    const [rewardsUSDCBalance, setRewardsUSDCBalance] = useState<string>("0.0");
    const [escrowUSDCBalance, setEscrowUSDCBalance] = useState<string>("0");

    useEffect(() => {
        (async () => {
            if (rewardsContract) {
                const balance = await getUSDCBalance(rewardsContract.address);
                setRewardsUSDCBalance(balance ? balance : "0.0");
            }
        })();
    }, [rewardsContract, lastEventAdded])

    useEffect(() => {
        (async () => {
            if (escrowContract) {
                const balance = await getUSDCBalance(escrowContract.address);
                setEscrowUSDCBalance(balance ? balance : "0.0");
            }
        })();
    }, [escrowContract, lastEventAdded])

    useEffect(() => {
        if (usdcContract) {
            (async () => {
                const tempUsers = await getUsers();
                setUsers(await Promise.all(tempUsers.map(async user => {
                    return {
                        ...user,
                        tokenId: user.tokenId,
                        usdcBalance: await getUSDCBalance(user.owner)
                    };
                })));

                setProperties(await getProperties());
                setBookings(await getBookings());
                setRewards(await getRewards());
            })();
        }
    }, [usdcContract, lastEventAdded]);

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

    const formatDate = (timestamp: string) => {
        return new Date(+timestamp * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    const getMonthName = (monthTimeStamp: number) => {
        const timestamp = monthTimeStamp * 1000 * 2595000; // Assuming the timestamp is in seconds
        const date = new Date(timestamp);

        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        const year = date.toLocaleDateString('en-US', { year: 'numeric' });

        return `${monthName} ${year}`;
    }

    return (
        <div className='flex flex-col h-[calc(100vh-100px)] shadow-xl'>
            <SectionScrollable>
                <div className='flex flex-col m-3 '>
                    <div className='shadow-lg mb-4'>
                        <div className='bg-gray-50 text-lg p-1 shadow flex'>
                            <div className='grow'>Users</div>
                            <div className='text-sm my-auto'>
                                <Link href="#" onClick={() => {
                                    dispatch(openSidePanel({
                                        title: 'Register user',
                                        contentComponent: PanelsEnum.RegisterUserPanel,
                                        sourceId: `TopNav`
                                    }));
                                }}>
                                    Create
                                </Link></div>
                        </div>
                        {users.length > 0 &&
                            <>
                                <div className='p-1 hover:bg-gray-50 grid grid-cols-8 text-sm font-semibold'>
                                    <div className='col-span-1'>Name</div>
                                    <div className='col-span-2'>Wallet</div>
                                    <div className='col-span-1'>TokenId</div>
                                    <div className='col-span-1'># Properties</div>
                                    <div className='col-span-1'># Bookings</div>
                                    <div className='col-span-1'>USDC Balance</div>
                                    <div className='col-span-1'></div>
                                </div>
                                {users.map((user, index) => {
                                    return (
                                        <div key={index} className='p-1 hover:bg-gray-50 grid grid-cols-8 text-sm'>
                                            <div className='col-span-1'>{user.firstName} {user.lastName}</div>
                                            <div className='col-span-2 truncate overflow-hidden'>{user.owner}</div>
                                            <div className='col-span-1'>{user.tokenId}</div>
                                            <div className='col-span-1'>{user.properties?.length}</div>
                                            <div className='col-span-1'>{user.bookings?.length}</div>
                                            <div className='col-span-1'>{user.usdcBalance}</div>
                                            <div className='col-span-1 pr-2 flex justify-end'>
                                                <Tooltip text="View User Profile">
                                                    <Link href="#" onClick={() => {
                                                        dispatch(openSidePanel({
                                                            title: `${user.firstName} ${user.lastName}`,
                                                            contentComponent: PanelsEnum.ViewUserPanel,
                                                            sourceId: `OverviewPage`
                                                        }))
                                                    }}><FontAwesomeIcon icon={faEye} className='text-blue-300 pr-2' /></Link>
                                                </Tooltip>
                                                <Tooltip text={`Register property (${user.firstName} ${user.lastName})`}>
                                                    <Link href="#" onClick={() => {
                                                        dispatch(openSidePanel({
                                                            title: `Register Property (${user.firstName} ${user.lastName})`,
                                                            contentComponent: PanelsEnum.RegisterPropertyPanel,
                                                            sourceId: `OverviewPage`
                                                        }))
                                                    }}> <FontAwesomeIcon icon={faHouse} className='text-blue-300' /></Link>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    )
                                })}
                            </>

                        }
                        {users.length === 0 && <div className='text-gray-500 text-center py-6'>No users registered</div>}
                    </div>

                    <div className='shadow-lg mb-4'>
                        <div className='bg-gray-50 text-lg p-1 shadow'>Properties</div>
                        {properties.length > 0 &&
                            <>
                                <div className='p-1 hover:bg-gray-50 grid grid-cols-6 text-sm font-semibold'>
                                    <div className='col-span-1'>Name</div>
                                    <div className='col-span-1'>Owner</div>
                                    <div className='col-span-1'>PropertyId</div>
                                    <div className='col-span-1'>USDC/night</div>
                                    <div className='col-span-1'># Bookings</div>
                                    <div className='col-span-1'></div>
                                </div>
                                {properties.map((property, index) => {
                                    return (
                                        <div key={index} className='p-1 hover:bg-gray-50 grid grid-cols-6 text-sm'>
                                            <div className='col-span-1'>{property.name} </div>
                                            <div className='col-span-1'>{(property.user as any).firstName} {(property.user as any).lastName}</div>
                                            <div className='col-span-1'>{property.propertyId}</div>
                                            <div className='col-span-1'>{property.pricePerNight}</div>
                                            <div className='col-span-1'>{property.bookings.length}</div>
                                            <div className='col-span-1 pr-2 flex justify-end'>
                                                <Tooltip text={`View Property`}>
                                                    <Link href="#" onClick={() => {
                                                        dispatch(openSidePanel({
                                                            title: `${property.name}`,
                                                            contentComponent: PanelsEnum.ViewPropertyPanel,
                                                            sourceId: `OverviewPage`
                                                        }))
                                                    }}><FontAwesomeIcon icon={faEye} className='text-blue-300 pr-2' /></Link>
                                                </Tooltip>
                                                <Tooltip text={`Create booking (${property.name})`}>
                                                    <Link href="#" onClick={() => {
                                                        dispatch(openSidePanel({
                                                            title: `Create booking (${property.name})`,
                                                            contentComponent: PanelsEnum.CreateBookingPanel,
                                                            sourceId: `OverviewPage`
                                                        }));
                                                        dispatch(setSelectedProperty(property))
                                                    }}> <FontAwesomeIcon icon={faCalendar} className='text-blue-300' /></Link>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    )
                                })}
                            </>

                        }
                        {properties.length === 0 && <div className='text-gray-500 text-center py-6'>No properties registered</div>}
                    </div>

                    <div className='shadow-lg mb-4'>
                        <div className='bg-gray-50 text-lg p-1 shadow'>Bookings</div>
                        {bookings.length > 0 &&
                            <>
                                <div className='p-1 hover:bg-gray-50 grid grid-cols-7 text-sm font-semibold'>
                                    <div className='col-span-1'>Property Name</div>
                                    <div className='col-span-1'>Renter</div>
                                    <div className='col-span-1'>From</div>
                                    <div className='col-span-1'>To</div>
                                    <div className='col-span-1'>Platform fees</div>
                                    <div className='col-span-1'>Total Paid</div>
                                    <div className='col-span-1'></div>
                                </div>
                                {bookings.map((booking, index) => {
                                    return (
                                        <div key={index} className='p-1 hover:bg-gray-50 grid grid-cols-7 text-sm'>
                                            <div className='col-span-1'>{(booking.property as any).name}</div>
                                            <div className='col-span-1'>{(booking.user as any).firstName} {(booking.user as any).lastName}</div>
                                            <div className='col-span-1'>{formatDate(booking.startDate)}</div>
                                            <div className='col-span-1'>{formatDate(booking.endDate)}</div>
                                            <div className='col-span-1'>${ethers.formatEther(booking.platformFeesAmount)}</div>
                                            <div className='col-span-1'>${ethers.formatEther(booking.totalPrice)}</div>
                                            <div className='col-span-1 pr-2 flex justify-end'>
                                                <Tooltip text={`View Booking`}>
                                                    <Link href="#" onClick={() => {
                                                        dispatch(openSidePanel({
                                                            title: `Booking Details`,
                                                            contentComponent: PanelsEnum.ViewBookingPanel,
                                                            sourceId: `OverviewPage`
                                                        }))
                                                    }}><FontAwesomeIcon icon={faEye} className='text-blue-300 pr-2' /></Link>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    )
                                })}
                            </>

                        }
                        {bookings.length === 0 && <div className='text-gray-500 text-center py-6'>No bookings available</div>}
                    </div>

                    <div className='shadow-lg mb-4'>
                        <div className='bg-gray-50 text-lg p-1 shadow'>Rewards</div>
                        {rewards.length > 0 &&
                            <>
                                <div className='p-1 hover:bg-gray-50 grid grid-cols-5 text-sm font-semibold'>
                                    <div className='col-span-1'>User</div>
                                    <div className='col-span-1'>Month</div>
                                    <div className='col-span-1'>Description</div>
                                    <div className='col-span-1'>Points</div>
                                </div>
                                {rewards.map((reward, index) => {
                                    return (
                                        <div key={index} className='p-1 hover:bg-gray-50 grid grid-cols-5 text-sm'>
                                            <div className='col-span-1'>{(reward.userObj as any)?.firstName} {(reward.userObj as any)?.lastName}</div>
                                            <div className='col-span-1'>{reward.month}</div>
                                            {/* <div className='col-span-1'>{getMonthName(reward.month)}</div> */}
                                            <div className='col-span-1'>{reward.description}</div>
                                            <div className='col-span-1'>{reward.points}</div>
                                        </div>
                                    )
                                })}
                            </>

                        }
                        {rewards.length === 0 && <div className='text-gray-500 text-center py-6'>No rewards available</div>}
                    </div>

                    <div className='shadow-lg mb-4'>
                        <div className='bg-gray-50 text-lg p-1 shadow'>Pools</div>

                        <div className='p-1 hover:bg-gray-50 grid grid-cols-5 text-sm font-semibold'>
                            <div className='col-span-1'>Name</div>
                            <div className='col-span-1'>USDC Balance</div>
                        </div>
                        <div className='p-1 hover:bg-gray-50 grid grid-cols-5 text-sm'>
                            <div className='col-span-1'>Rewards Contract</div>
                            <div className='col-span-1'>${rewardsUSDCBalance}</div>
                        </div>
                        <div className='p-1 hover:bg-gray-50 grid grid-cols-5 text-sm'>
                            <div className='col-span-1'>Escrow Contract</div>
                            <div className='col-span-1'>${escrowUSDCBalance}</div>
                        </div>
                    </div>
                </div >
            </SectionScrollable>
        </div>

    );
};
