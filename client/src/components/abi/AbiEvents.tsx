// Import the required dependencies
import React, { useContext, useEffect, useState } from 'react';
import { SectionHeader } from '../SectionHeader';
import { SectionScrollable } from '../SectionScrollable';
import { useAppSelector } from '../../../store/hooks';


export const AbiEvents = () => {
    const evmEvents = useAppSelector((state) => state.evmEvent.evmEvents);

    const openEventsPanel = () => {

    }

    return (
        <div className='flex flex-col h-[calc(100vh-100px)] shadow-xl'>
            <SectionHeader title='Events' showView={true} viewClicked={() => openEventsPanel()} />
            <SectionScrollable>
                <>
                    {evmEvents && evmEvents?.length === 0 && <div className='text-center pt-10 text-lg'>No Events Found</div>}
                    {evmEvents && evmEvents?.length > 0 &&
                        evmEvents.map((evmEvent, index) => {

                            return (
                                <div key={index} className='p-2 border-b-2 flex flex-col text-sm shadow-2xl'>
                                    <div className='flex pb-1 font-bold'>
                                        <div>{evmEvent.eventName}</div>
                                        <div className='pl-1 grow'>({evmEvent.contract} contract)</div>
                                        <div className='pr-1'>Block #{evmEvent.blockNumber}</div>
                                    </div>
                                    {Object.entries(evmEvent.eventData).map(([key, value], idx) => (
                                        <div key={idx} className='flex hover:bg-blue-100 p-1'>
                                            <div className='font-semibold grow'>{key}:</div>
                                            <div className='text-right text-xs'>{value}</div>
                                             
                                        </div>
                                    ))}
                                </div>
                            )
                        })
                    }
                </>
            </SectionScrollable>
        </div>

    );
};

