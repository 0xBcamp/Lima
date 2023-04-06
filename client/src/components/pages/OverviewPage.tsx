// Import the required dependencies
import React, { useContext, useEffect, useState } from 'react';
import { IUser } from '../../../models/user';
import { getUsers } from '../../../services/userService';
import { useAppSelector } from '../../../store/hooks';

export const OverviewPage = () => {

    const lastEventAdded = useAppSelector((state) => state.evmEvent.lastEventAdded);

    const [users, setUsers] = useState<IUser[]>([])

    useEffect(() => {
        (async () => {
            setUsers(await getUsers());
        })();
    }, [lastEventAdded]);

    return (
        <>
            <div className='flex flex-col shadow-lg m-3 '>
                <div className='bg-gray-50 text-lg p-1 shadow'>Users</div>
                {users.length > 0 &&
                    <>
                        <div className='p-1 hover:bg-gray-50 grid grid-cols-5 text-sm font-semibold'>
                            <div className='col-span-1'>Name</div>
                            <div className='col-span-2'>Wallet</div>
                            <div className='col-span-1'>TokenId</div>
                            <div className='col-span-1'># Properties</div>
                        </div>
                        {users.map((user, index) => {
                            return (
                                <div key={index} className='p-1 hover:bg-gray-50 grid grid-cols-5 text-sm'>
                                    <div className='col-span-1'>{user.firstName} {user.lastname}</div>
                                    <div className='col-span-2 truncate overflow-hidden'>{user.owner}</div>
                                    <div className='col-span-1'>{user.tokenId}</div>
                                    <div className='col-span-1'>{user.properties.length}</div>
                                </div>
                            )
                        })}
                    </>

                }
            </div>
        </>

    );
};
