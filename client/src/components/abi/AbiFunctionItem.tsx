// Import the required dependencies
import React, { useContext, useEffect, useState } from 'react';
import { ISolContract_ABI } from '../../../models/solContract';
import { FC_Input } from '../form-controls/FC_Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faCalendarAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { AbiInputOutputTypesEnum } from '@/enums/AbiInputOutputTypesEnum';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { openSidePanel } from '../../../store/slices/sidePanelSlice';
import { PanelsEnum } from '@/enums/PanelsEnum';
import EthersContext from '../../../context/EthersContext';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";

interface IAbiFunctionItemProps {
    abiFunction: ISolContract_ABI,
    valueChanged: (inputIndex: number, functionName: string, value: any) => void
}

export const AbiFunctionItem = ({ abiFunction, valueChanged }: IAbiFunctionItemProps) => {
    const dispatch = useAppDispatch();

    const selectedContract = useAppSelector((state) => state.solContract?.selectedContract);
    const selectedAccount = useAppSelector((state) => state.account.selectedAccount);

    const { provider } = useContext(EthersContext);

    const transactionPendingToast = () => {
        toast.info("Transaction Pending");
    }

    return (
        <>
            {abiFunction && <div className='px-2 py-3 hover:bg-blue-50'>
                <div className='text-sm mb-1 flex'>
                    <div className='grow'>{abiFunction.name}</div>
                    <div className='text-sm text-blue-700 hover:cursor-pointer' onClick={async () => {

                        if (selectedContract && selectedAccount) {
                            const wallet = new ethers.Wallet(selectedAccount.privateKey, provider);
                            const contract = new ethers.Contract(selectedContract.address, selectedContract.abi, wallet);
                            const pendingToastId = toast.info('Transaction Pending...', {
                                autoClose: false,
                            });

                            try {
                                let inputs: any[] = [];

                                if (abiFunction.inputs && abiFunction.inputs.length > 0) {
                                    inputs = abiFunction.inputs?.map(input => {
                                        return input.value ? input.value : ""
                                    });
                                }

                                if (abiFunction.stateMutability === "view") {
                                    const returnedData = inputs.length === 0 ? await (contract as any)[abiFunction.name!]() : await (contract as any)[abiFunction.name!](...inputs);
                                    
                                    toast.dismiss(pendingToastId); // Close the pending toast.
                                    toast.success(<>
                                        <div>Transaction Successful</div>
                                        <div>Response:</div>
                                        <div>{`${returnedData}`}</div>
                                    </>);
                                } else {
                                    // Step 1: Call the contract function and receive the transaction response.
                                    const txResponse = await (contract as any)[abiFunction.name!](...inputs);

                                    // Step 2: Wait for the transaction to be mined.
                                    const txReceipt = await txResponse.wait();

                                    toast.dismiss(pendingToastId); // Close the pending toast.
                                    toast.success('Transaction successful!');
                                }



                                // Process the transaction receipt as needed.
                            } catch (error: any) {
                                let displayMessage = error;

                                if (error?.data?.message) {
                                    const message = error.data.message;
                                    const reason = message.split('revert ')[1]?.split(' ')[0];
                                    displayMessage = reason ? reason : message;
                                } else if (error?.message) {
                                    displayMessage = error.message;
                                }

                                console.error(error);
                                toast.dismiss(pendingToastId); // Close the pending toast.
                                toast.error((displayMessage as string).toString());
                            }

                            // const result = await contract.callStatic.();
                            // const mintingResult = await (contract as any).mintUserNFT("dfsdf");
                            // toast.promise(
                            //     mintingResult,
                            //     {
                            //       pending: 'Promise is pending',
                            //       success: 'Promise resolved 👌',
                            //       error: 'Promise rejected 🤯'
                            //     }
                            // )
                        }


                    }}>Submit</div>
                </div>
                {abiFunction.inputs && abiFunction?.inputs?.length > 0 &&
                    abiFunction?.inputs.map((input, index) => {
                        return (
                            <div key={index} className='flex'>
                                <div className='grow'>
                                    <FC_Input
                                        value={input.value}
                                        onChange={(ev) => valueChanged(index, abiFunction.name!, ev.target.value)}
                                        placeholder={input.name}
                                    />
                                </div>
                                {input.type === AbiInputOutputTypesEnum.address && <div className='pl-2 my-auto text-blue-700'>
                                    <FontAwesomeIcon icon={faUserCircle} onClick={() => {
                                        dispatch(openSidePanel({
                                            title: 'Accounts',
                                            contentComponent: PanelsEnum.AccountsPanel,
                                            sourceId: `${abiFunction.name}-${index}`
                                        }));
                                    }} />
                                </div>}
                                {input.name?.toLowerCase().includes("date") && <div className='pl-2 my-auto text-blue-700'>
                                    <DatePicker selected={new Date()} onChange={(date) => valueChanged(index, abiFunction.name!, date?.getTime())} customInput={
                                        <button>
                                            <FontAwesomeIcon icon={faCalendarAlt} />
                                        </button>
                                    } />
                                </div>}
                            </div>
                        )
                    })
                }
            </div>}
        </>


    );
};

