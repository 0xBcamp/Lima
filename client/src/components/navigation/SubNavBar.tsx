// Import the required dependencies
import React, { useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { Spinner } from '../Spinner';
import { setSelectedContract } from '../../../store/slices/solContractSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { closeSidePanel, openSidePanel } from '../../../store/slices/sidePanelSlice';
import { PanelsEnum } from '@/enums/PanelsEnum';
import { PagesEnum } from '@/enums/PagesEnum';
import { setPage } from '../../../store/slices/navigationSlice';


export const SubNavBar = () => {
    const dispatch = useAppDispatch();

    const contracts = useAppSelector((state) => state.solContract?.contracts);
    const isLoadingContracts = useAppSelector((state) => state.solContract?.isLoadingContracts);
    const selectedContract = useAppSelector((state) => state.solContract?.selectedContract);
    const panelSelectedContract = useAppSelector((state) => state.sidePanel.panels?.find(x => x.contentComponent === PanelsEnum.ContractsPanel));
    const navigationPage = useAppSelector((state) => state.navigation.page);

    useEffect(() => {
        if (panelSelectedContract?.selectedContract && panelSelectedContract.sourceId === "SubNavBar") {
            dispatch(setSelectedContract(panelSelectedContract?.selectedContract));
            dispatch(closeSidePanel({ contentComponent: PanelsEnum.ContractsPanel }));
        }
    }, [panelSelectedContract?.selectedContract]);
    
    return (
        <>
            <nav className="bg-blue-100">
                {isLoadingContracts &&
                    <div className="p-2 flex justify-end">
                        <div>Loading contracts</div>
                        <div className='pl-3 pt-1'><Spinner /></div>
                    </div>}
                {!isLoadingContracts && contracts?.length === 0 && <div className="p-2 text-right">No contracts found</div>}
                {!isLoadingContracts && contracts && contracts.length > 0 &&
                    <div className="text-right flex ">
                        <div className={`p-2 flex  ${navigationPage === PagesEnum.Overview ? "bg-blue-500 text-white" : "hover:cursor-pointer hover:bg-blue-200"}`} onClick={() => dispatch(setPage(PagesEnum.Overview))}>Overview</div>
                        <div className={`p-2 flex  ${navigationPage === PagesEnum.Client ? "bg-blue-500 text-white" : "hover:cursor-pointer hover:bg-blue-200"}`} onClick={() => dispatch(setPage(PagesEnum.Client))}>Client</div>
                        {/* <div className={`p-2 flex  ${navigationPage === PagesEnum.Graphs ? "bg-blue-500 text-white" : "hover:cursor-pointer hover:bg-blue-200"}`} onClick={() => dispatch(setPage(PagesEnum.Graphs))}>Graphs</div> */}
                        <div className='grow'></div>
                        <div className='p-2 flex hover:cursor-pointer hover:bg-blue-50' onClick={() => {
                            dispatch(openSidePanel({
                                title: 'Contracts',
                                contentComponent: PanelsEnum.ContractsPanel,
                                sourceId: `SubNavBar`
                            }))
                        }}>
                            {!selectedContract && <div className='grow'>Select Contract</div>}
                            {selectedContract && <div className='grow'>{selectedContract.name}</div>}
                            <div className='pl-2'><FontAwesomeIcon icon={faCaretDown} /></div>
                        </div>

                    </div>}
                {/* {!isLoadingContracts && contracts && contracts.length > 0 && <div className="flex">
                    {contracts.map((contract, index) => {
                        return (
                            <div key={index} className={`py-2 px-4 ${selectedContract?.name === contract.name ? "bg-blue-500 text-white " : "hover:bg-blue-200 hover:cursor-pointer"}`} onClick={() => dispatch(setSelectedContract(contract))}>
                                {contract.name}
                            </div>
                        )
                    })}
                </div>} */}
            </nav>
        </>

    );
};

