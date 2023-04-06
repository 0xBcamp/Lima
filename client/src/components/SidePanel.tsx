// Import the required dependencies
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { closeSidePanel } from '../../store/slices/sidePanelSlice';
import AccountsPanel from './panels/AccountsPanel';
import { PanelsEnum } from '@/enums/PanelsEnum';
import ContractsPanel from './panels/ContractsPanel';
import BlockchainPanel from './panels/BlockchainPanel';

const renderContentComponent = (contentComponent: string, onClose: () => void) => {
  switch (contentComponent) {
    case PanelsEnum.AccountsPanel:
      return (<AccountsPanel />);
    case PanelsEnum.ContractsPanel:
      return (<ContractsPanel />);
    case PanelsEnum.BlockchainPanel:
      return (<BlockchainPanel />);
    default:
      return null;
  }
};

const SidePanel: React.FC = () => {
  const panel = useAppSelector((state) => state.sidePanel.panels?.length > 0 ? state.sidePanel.panels[state.sidePanel.panels?.length - 1] : null);

  const dispatch = useAppDispatch();

  const panelStyles = panel?.isOpen
    ? 'translate-x-0 ease-out transition-medium duration-300'
    : 'translate-x-full ease-in transition-medium duration-300';

  const onClose = () => {
    if (panel) {
      dispatch(closeSidePanel({ contentComponent: panel.contentComponent }));
    }
  };

  return (
    <>
      {panel && <div className={`fixed top-0 right-0 w-96 h-full bg-gray-50 shadow-2xl transform ${panelStyles}`}>
        <div className='flex flex-col h-full'>
          <div className='bg-blue-100 p-2 flex border-gray-300 border-b-2'>
            <div className='grow'>{panel.title}</div>
            <div className='pr-2 hover:cursor-pointer' onClick={onClose}><FontAwesomeIcon icon={faClose} /></div>
          </div>
          <div className='p-2 overflow-y-auto flex-grow'>{renderContentComponent(panel.contentComponent, onClose)}</div>
        </div>
      </div>}
    </>
  );
};

export default SidePanel;