// Import the required dependencies
import React, { useContext, useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { Spinner } from './Spinner';

interface ISectionHeaderProps {
    title: string,
    showView?: boolean,
    viewClicked?: () => void
}

export const SectionHeader = ({title, showView, viewClicked}: ISectionHeaderProps) => {
    return (
        <div className='text-lg bg-blue-50 p-2 flex'>
            <div className='grow'>{title}</div>
            {showView && viewClicked && <div className='text-sm pr-2 m-auto hover:cursor-pointer' onClick={() => viewClicked()}>View</div>}
        </div>
    );
};

