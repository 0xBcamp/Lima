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
                        <div className='p-1 hover:bg-gray-50 grid grid-cols-3'>
                            <div>Name</div>
                            <div>Wallet</div>
                            <div>TokenId</div>
                        </div>
                        {users.map((user, index) => {
                            return (
                                <div className='p-1 hover:bg-gray-50 grid grid-cols-3'>
                                    <div>{user.firstName} {user.lastname}</div>
                                    <div>{user.owner} </div>
                                    <div>{user.tokenId} </div>
                                </div>
                            )
                        })}
                    </>

                }
            </div>
        </>

    );
};
