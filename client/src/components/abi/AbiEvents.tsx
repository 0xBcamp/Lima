// Import the required dependencies
import React, { useContext, useEffect, useState } from 'react';
import { SectionHeader } from '../SectionHeader';
import { SectionScrollable } from '../SectionScrollable';


export const AbiEvents = () => {
    // const contracts = useAppSelector((state) => state.solContract?.contracts);
    // const isLoadingContracts = useAppSelector((state) => state.solContract?.isLoadingContracts);

    const openEventsPanel = () => {
        console.log('openEventsPanel');
    }

    return (
        <div className='flex flex-col h-[calc(100vh-100px)] shadow-xl'>
            <SectionHeader title='Events' showView={true} viewClicked={() => openEventsPanel()} />
            <SectionScrollable >
                <div>
                    gdfgdfgdfg
                </div>
            </SectionScrollable>
        </div>

    );
};

