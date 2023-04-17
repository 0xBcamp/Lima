import React, { ChangeEvent } from 'react';

interface IFC_TextAreaProps {
  placeholder?: string;
  value?: any;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  customClassName?: string;
  error?: string;
  label?: string;
  rows?: number;
  name?: string;
}

export const FC_TextArea = ({
  label,
  placeholder = 'Enter text...',
  value,
  onChange,
  customClassName = '',
  error,
  rows = 7,
  name
}: IFC_TextAreaProps) => {
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
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={classNames}
        rows={rows}
        name={name}
      />
      {error && (
        <div className='text-sm text-red-600 mt-1'>{error}</div>
      )}
    </div>
  );
};