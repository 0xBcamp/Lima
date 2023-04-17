// Import the required dependencies
import React, { useContext, useEffect, useState } from 'react';
import { ClientNavBar } from '../navigation/ClientNavBar';
import { useAppSelector } from '../../../store/hooks';
import { getUser } from '../../../services/userService';
import { IUser } from '../../../models/user';
import { IProperty } from '../../../models/property';
import { getProperties } from '../../../services/propertyService';
import PropertyGrid from '../PropertyGrid';
import { SectionScrollable } from '../SectionScrollable';

export const ClientPage = () => {

    const selectedAccount = useAppSelector((state) => state.account.selectedAccount);
    const lastEventAdded = useAppSelector((state) => state.evmEvent.lastEventAdded);
    const blockNumber = useAppSelector((state) => state.blockchain.blockNumber);

    const [user, setUser] = useState<IUser>();
    const [properties, setProperties] = useState<IProperty[]>([]);

    useEffect(() => {
        if (selectedAccount) {
            (async () => {
                const [currentUser, currentProperties] = await Promise.all([
                    await getUser(selectedAccount.address),
                    await getProperties()
                ])
                setUser(currentUser);
                setProperties(currentProperties);
            })();
        }
    }, [selectedAccount?.address, blockNumber, lastEventAdded])


    return (
        <div className='flex flex-col h-[calc(100vh-100px)] shadow-xl'>
            <ClientNavBar user={user} />
            <SectionScrollable>
                <div className='p-4'>
                    <PropertyGrid properties={properties}/>
                </div>
            </SectionScrollable>

        </div>

    );
};
