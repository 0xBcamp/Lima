// Import the required dependencies
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: JSX.Element;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose, title, children }) => {
  const panelStyles = isOpen
    ? 'translate-x-0 ease-out transition-medium duration-300'
    : 'translate-x-full ease-in transition-medium duration-300';

  return (
    <div className={`fixed top-0 right-0 w-96 h-full bg-gray-50 shadow-2xl transform ${panelStyles}`}
    >
      <div className='flex flex-col h-full'>
        <div className='bg-blue-100 p-2 flex border-gray-300 border-b-2'>
          <div className='grow'>{title}</div>
          <div className='pr-2 hover:cursor-pointer' onClick={onClose}><FontAwesomeIcon icon={faClose} /></div>
        </div>
        <div className='p-2 overflow-y-auto flex-grow'>{children}</div>
      </div>

    </div>
  );
};

export default SidePanel;