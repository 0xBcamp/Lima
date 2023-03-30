// Import the required dependencies
import React, { useContext, useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { Spinner } from './Spinner';


export const ContractBar = () => {
    const contracts = useAppSelector((state) => state.solContract?.contracts);
    const isLoadingContracts = useAppSelector((state) => state.solContract?.isLoadingContracts);

    return (
        <>
            <nav className="bg-blue-100">
                {isLoadingContracts &&
                    <div className="p-2 flex justify-center items-center">
                        <div>Loading contracts</div>
                        <div className='pl-3 pt-1'><Spinner /></div>
                    </div>}
                {!isLoadingContracts && contracts?.length === 0 && <div className="p-2 text-center">No contracts found</div>}
                {!isLoadingContracts && contracts && contracts.length > 0 && <div className="flex">
                    {contracts.map((contract, index) => {
                        return (
                            <div key={index} className="p-2 hover:bg-blue-200 hover:cursor-pointer">
                                {contract.name}
                            </div>
                        )
                    })}
                </div>}
            </nav>
        </>

    );
};

