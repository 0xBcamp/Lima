// Import the required dependencies
import React, { useContext, useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';


export const Spinner = () => {
    return (
        <div className="w-4 h-4 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
    );
};

