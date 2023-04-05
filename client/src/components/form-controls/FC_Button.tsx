// Import the required dependencies
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ButtonHTMLAttributes, ChangeEvent, useContext, useEffect, useState } from 'react';

interface IFC_ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  customClassName?: string;
}

export const FC_Button = ({
  text,
  customClassName = '',
  ...props
}: IFC_ButtonProps) => {
  // const baseStyle = `bg-blue-500 hover:bg-blue-600 text-white  py-1 px-2 rounded-md transition duration-150 ease-in-out`;
  const baseStyle = `bg-blue-500 hover:bg-blue-600 text-white px-2 rounded-md transition duration-150 ease-in-out`;
  const classNames = `${baseStyle} ${customClassName}`;
  //<FontAwesomeIcon icon={faPaperPlane} />
  return (
    <button className={classNames} {...props}>
      <FontAwesomeIcon icon={faPaperPlane} />
    </button>
  );
};
