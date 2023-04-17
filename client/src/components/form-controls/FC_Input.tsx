// Import the required dependencies
import { faCalendarAlt, faUser, faUserCheck, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';

interface IFC_InputProps {
  type?: string;
  placeholder?: string;
  value?: any;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  customClassName?: string;
  error?: string;
  label?: string;
  icon?: typeof faCalendarAlt;
  name?: string;
}

export const FC_Input = ({
  type = 'text',
  label, // Add this line
  placeholder = 'Enter text...',
  value,
  onChange,
  customClassName = '',
  error,
  icon,
  name,
}: IFC_InputProps) => {
  const baseStyle =
    'border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full py-2 px-4 text-sm rounded-md outline-none transition duration-150 ease-in-out';
  const errorStyle = error ? 'border-red-600' : '';
  const classNames = `${baseStyle} ${errorStyle}`;

  return (
    <div className={`flex flex-col mb-1 ${customClassName}`}>
      {label && (
        <label className='text-sm font-semibold text-gray-600 mb-1'>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={classNames}
          name={name}
        />
        {icon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-blue-700">
            <FontAwesomeIcon icon={icon} />
          </div>
        )}
      </div>
      {error && (
        <div className='text-sm text-red-600 mt-1'>{error}</div>
      )}
    </div>
  );
};

