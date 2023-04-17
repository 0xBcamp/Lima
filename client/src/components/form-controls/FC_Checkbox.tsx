// components/form-controls/FC_Checkbox.tsx
import React from 'react';

interface FC_CheckboxProps {
  name?: string;
  labelText?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  customClassName?: string;
}

export const FC_Checkbox: React.FC<FC_CheckboxProps> = ({
  name,
  labelText,
  checked,
  onChange,
  customClassName = '',
}) => {
  const baseStyle = 'form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out mr-2 pt-1';
  const classNames = `${baseStyle} ${customClassName}`;

  return (
    <div className='flex flex-row'>
      <div className='my-auto'>
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          className={classNames}
        />
      </div>

      {labelText && (
        <div className=''>{labelText}</div>
      )}
    </div>
  );
};
