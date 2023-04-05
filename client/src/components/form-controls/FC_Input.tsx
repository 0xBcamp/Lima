// Import the required dependencies
import { faUser, faUserCheck, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';

interface IFC_InputProps {
    type?: string;
    placeholder?: string;
    value?: any;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    customClassName?: string;
}

export const FC_Input = ({
    type = 'text',
    placeholder = 'Enter text...',
    value,
    onChange,
    customClassName = '',
}: IFC_InputProps) => {
    const baseStyle = `mb-1 border-blue-100 focus:border-blue-200 focus:ring-1 focus:ring-blue-200 w-full p-1 text-sm border-2 rounded-sm outline-none transition duration-150 ease-in-out`;
    const classNames = `${baseStyle} ${customClassName}`;

    return (
            <div >
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={classNames}
                />
            </div>

    );
};
