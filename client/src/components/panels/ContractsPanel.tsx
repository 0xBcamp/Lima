import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setSidePanelSelectedContract } from '../../../store/slices/sidePanelSlice';

const ContractsPanel: React.FC = () => {

    const dispatch = useAppDispatch();

    const contracts = useAppSelector((state) => state.solContract.contracts);
    const selectedContract = useAppSelector((state) => state.solContract.selectedContract);

    console.log('contracts :>> ', contracts);

    return (
        <>
            {contracts && contracts.map((contract, index) => {
                return (
                    <div
                        key={index}
                        className={`flex items-center text-sm p-1 border-b-2 border-gray-200 hover:cursor-pointer hover:bg-blue-50 ${selectedContract?.address === contract.address ? "bg-blue-200" : ""}`}
                        onClick={() => { dispatch(setSidePanelSelectedContract(contract)); }}
                    >
                        <div className="flex-grow">
                            <div className="flex">
                                <div className='font-semibold grow'>{contract.name}</div>
                            </div>
                            <div className="text-gray-500 text-xs">{contract.address}</div>
                        </div>
                    </div>
                )
            })}
        </>
    );
};

export default ContractsPanel;