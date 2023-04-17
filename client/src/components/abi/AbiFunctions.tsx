// Import the required dependencies
import React, { useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { Spinner } from '../Spinner';
import { SectionHeader } from '../SectionHeader';
import { SectionScrollable } from '../SectionScrollable';
import { NoContractSelected } from '../NoContractSelected';
import { AbiTypesEnum } from '@/enums/AbiTypesEnum';
import { ISolContract_ABI } from '../../../models/solContract';
import { AbiFunctionItem } from './AbiFunctionItem';
import { closeSidePanel } from '../../../store/slices/sidePanelSlice';
import { PanelsEnum } from '@/enums/PanelsEnum';


export const AbiFunctions = () => {
    const dispatch = useAppDispatch();

    const selectedContract = useAppSelector((state) => state.solContract?.selectedContract);
    const panelSelectedAccount = useAppSelector((state) => state.sidePanel.panels?.find(x => x.contentComponent === PanelsEnum.AccountsPanel));

    const [contractFunctions, setContractFunctions] = useState<ISolContract_ABI[]>([])


    useEffect(() => {
        if (panelSelectedAccount?.selectedAccount) {
            const [sourceFunctionName, sourceIndex] = panelSelectedAccount.sourceId.split("-");
            setContractFunctions(contractFunctions.map(contractFunction => {
                if (sourceFunctionName === contractFunction.name) {
                    return {
                        ...contractFunction,
                        inputs: contractFunction.inputs?.map((input, index) => {
                            if (sourceIndex === index.toString()) {
                                return {
                                    ...input,
                                    value: panelSelectedAccount.selectedAccount?.address
                                }
                            } else {
                                return {
                                    ...input
                                }
                            }

                        })
                    }
                } else {
                    return {
                        ...contractFunction
                    }
                }
            }));

            dispatch(closeSidePanel({ contentComponent: PanelsEnum.AccountsPanel }));
        }
    }, [panelSelectedAccount?.selectedAccount]);

    useEffect(() => {
        setContractFunctions(selectedContract ? selectedContract.abi.filter(x => x.type === AbiTypesEnum.Function) : []);
    }, [selectedContract]);

    return (
        <div className='flex flex-col h-[calc(100vh-100px)] shadow-xl'>
            {/* {isAccountsPanelOpen && <AccountsPanel isOpen={isAccountsPanelOpen} onClose={() => setIsAccountsPanelOpen(false)}></AccountsPanel>} */}
            <SectionHeader title='Functions' />
            <SectionScrollable>
                <div>
                    {!selectedContract && <NoContractSelected />}
                    {selectedContract &&
                        contractFunctions.map((contractFunction, index) => {

                            return (
                                <div key={index}>
                                    <AbiFunctionItem abiFunction={contractFunction} valueChanged={(inputIndex: number, functionName: string, value: any) => {
                                        setContractFunctions(contractFunctions.map(func => {
                                            if (functionName === func.name) {
                                                return {
                                                    ...func,
                                                    inputs: func.inputs?.map((input, funcInputIndex) => {
                                                        if (inputIndex === funcInputIndex) {
                                                            return {
                                                                ...input,
                                                                value
                                                            }
                                                        } else {
                                                            return {
                                                                ...input
                                                            }
                                                        }

                                                    })
                                                }
                                            } else {
                                                return {
                                                    ...func
                                                }
                                            }
                                        }));
                                    }} />
                                </div>
                            )
                        })
                    }
                </div>
            </SectionScrollable>
        </div>

    );
};

