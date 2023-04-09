// Import the required dependencies
import React, { useContext, useEffect, useState } from 'react';
import { IUser, IUserDto } from '../../../models/user';
import { getUsers } from '../../../services/userService';
import { useAppSelector } from '../../../store/hooks';
import { IProperty } from '../../../models/property';
import { IBooking } from '../../../models/booking';
import { getProperties } from '../../../services/propertyService';
import { getBookings } from '../../../services/bookingService';
import EthersContext from '../../../context/EthersContext';
import { ethers } from 'ethers';
import { IReward } from '../../../models/reward';
import { getRewards } from '../../../services/rewardsService';

export const OverviewPage = () => {
    const { provider } = useContext(EthersContext);

    const usdcContract = useAppSelector((state) => state.solContract.contracts?.find(x => x.name === "DummyUSDC"));
    const lastEventAdded = useAppSelector((state) => state.evmEvent.lastEventAdded);

    const [users, setUsers] = useState<IUserDto[]>([]);
    const [properties, setProperties] = useState<IProperty[]>([]);
    const [bookings, setBookings] = useState<IBooking[]>([]);
    const [rewards, setRewards] = useState<IReward[]>([]);

    useEffect(() => {
        if (usdcContract) {
            (async () => {
                const tempUsers = await getUsers();
                setUsers(await Promise.all(tempUsers.map(async user => {
                    return {
                        ...user,
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

            console.log('balance :>> ', balance);

            // Convert the balance to a human-readable format
            return ethers.formatEther(balance);
        }

    }

    return (
        <>
            <div className='flex flex-col m-3 '>
                <div className='shadow-lg mb-4'>
                    <div className='bg-gray-50 text-lg p-1 shadow'>Users</div>
                    {users.length > 0 &&
                        <>
                            <div className='p-1 hover:bg-gray-50 grid grid-cols-7 text-sm font-semibold'>
                                <div className='col-span-1'>Name</div>
                                <div className='col-span-2'>Wallet</div>
                                <div className='col-span-1'>TokenId</div>
                                <div className='col-span-1'># Properties</div>
                                <div className='col-span-1'># Bookings</div>
                                <div className='col-span-1'>USDC Balance</div>
                            </div>
                            {users.map((user, index) => {
                                return (
                                    <div key={index} className='p-1 hover:bg-gray-50 grid grid-cols-7 text-sm'>
                                        <div className='col-span-1'>{user.firstName} {user.lastname}</div>
                                        <div className='col-span-2 truncate overflow-hidden'>{user.owner}</div>
                                        <div className='col-span-1'>{user.tokenId}</div>
                                        <div className='col-span-1'>{user.properties.length}</div>
                                        <div className='col-span-1'>{user.bookings.length}</div>
                                        <div className='col-span-1'>{user.usdcBalance}</div>
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
                            <div className='p-1 hover:bg-gray-50 grid grid-cols-5 text-sm font-semibold'>
                                <div className='col-span-1'>Name</div>
                                <div className='col-span-1'>Owner</div>
                                <div className='col-span-1'>PropertyId</div>
                                <div className='col-span-1'>USDC/night</div>
                                <div className='col-span-1'># Bookings</div>
                            </div>
                            {properties.map((property, index) => {
                                return (
                                    <div key={index} className='p-1 hover:bg-gray-50 grid grid-cols-5 text-sm'>
                                        <div className='col-span-1'>{property.name} </div>
                                        <div className='col-span-1'>{(property.user as any).firstName} {(property.user as any).lastname}</div>
                                        <div className='col-span-1'>{property.propertyId}</div>
                                        <div className='col-span-1'>{property.pricePerNight}</div>
                                        <div className='col-span-1'>{property.bookings.length}</div>
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
                            <div className='p-1 hover:bg-gray-50 grid grid-cols-5 text-sm font-semibold'>
                                <div className='col-span-1'>Property Name</div>
                                <div className='col-span-1'>Renter</div>
                                <div className='col-span-1'>From</div>
                                <div className='col-span-1'>To</div>
                            </div>
                            {bookings.map((booking, index) => {
                                return (
                                    <div key={index} className='p-1 hover:bg-gray-50 grid grid-cols-5 text-sm'>
                                        <div className='col-span-1'>{(booking.property as any).name}</div>
                                        <div className='col-span-1'>{(booking.user as any).firstName} {(booking.user as any).lastName}</div>
                                        <div className='col-span-1'>{booking.startDate.toString()}</div>
                                        <div className='col-span-1'>{booking.endDate.toString()}</div>
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
                                        <div className='col-span-1'>{(reward.userObj as any).firstName} {(reward.userObj as any).lastname}</div>
                                        <div className='col-span-1'>{reward.month}</div>
                                        <div className='col-span-1'>{reward.description}</div>
                                        <div className='col-span-1'>{reward.points}</div>
                                    </div>
                                )
                            })}
                        </>

                    }
                    {rewards.length === 0 && <div className='text-gray-500 text-center py-6'>No rewards available</div>}
                </div>
                {/* {!selectedUser && <div className='mt-20 text-lg text-center'>No user selected</div>}
                {selectedUser && <div className='shadow-lg mb-4'>
                    <div className='bg-gray-200 text-lg p-1'>{selectedUser.firstName} {selectedUser.lastname}</div>
                    <div className='px-2 text-sm'>
                        <div className='font-bold'>Properties</div>
                        {selectedUser.properties.length === 0 && <div className='p-4'>No properties registered</div>}
                        {selectedUser.properties.length > 0 &&
                            <>
                                <div className='p-1 hover:bg-gray-50 grid grid-cols-7 text-sm font-semibold'>
                                    <div className='col-span-1'>Location</div>
                                    <div className='col-span-2'>Country</div>
                                    <div className='col-span-1'>Owner</div>
                                    <div className='col-span-1'>PropertyId</div>
                                    <div className='col-span-1'>Price/Night</div>
                                    <div className='col-span-1'># Bookings</div>
                                </div>
                                {selectedUser.properties.map((property: any, index: number) => {
                                    return (
                                        <div key={index} className='p-1 hover:bg-gray-50 grid grid-cols-7 text-sm'>
                                            <div className='col-span-1'>{property.location}</div>
                                            <div className='col-span-1'>{property.country}</div>
                                            <div className='col-span-2 truncate overflow-hidden'>{property.owner}</div>
                                            <div className='col-span-1'>{property.propertyId}</div>
                                            <div className='col-span-1'>{property.pricePerNight}</div>
                                            <div className='col-span-1'>{0}</div>
                                        </div>
                                    )
                                })}
                            </>

                        }
                    </div>
                </div>} */}

            </div>

        </>

    );
};
