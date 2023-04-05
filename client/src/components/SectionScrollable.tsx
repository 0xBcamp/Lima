// Import the required dependencies
import React, { useContext, useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { Spinner } from './Spinner';

interface ISectionScrollableProps {
    children?: JSX.Element
}

export const SectionScrollable = ({children}: ISectionScrollableProps) => {
    return (
        <div className='overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-100'>
            {children}
        </div>
    );
};

