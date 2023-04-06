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
  const baseStyle = `bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 transition duration-150 ease-in-out`;
  const classNames = `${baseStyle} ${customClassName}`;

  return (
    <button className={classNames} {...props}>
      {text}
    </button>
  );
};
