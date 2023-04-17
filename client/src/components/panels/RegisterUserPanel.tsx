// Import the required dependencies
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import EthersContext from '../../../context/EthersContext';
import { FC_Button } from '../form-controls/FC_Button';
import { reset } from '../../../services/appService';
import { Spinner } from '../Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { FC_Input } from '../form-controls/FC_Input';
import { IUserDto } from '../../../models/user';
import { addUser, getUser } from '../../../services/userService';
import { ethers } from 'ethers';
import { PanelsEnum } from '@/enums/PanelsEnum';
import { closeSidePanel } from '../../../store/slices/sidePanelSlice';
import { toast } from 'react-toastify';

const RegisterUserPanel = () => {
    const { provider } = useContext(EthersContext);

    const dispatch = useAppDispatch();

    const selectedAccount = useAppSelector((state) => state.account.selectedAccount);
    const userContract = useAppSelector((state) => state.solContract.contracts?.find(x => x.name === "User"));

    const [isBusyResetting, setIsBusyResetting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isBusy, setIsBusy] = useState(false);

    const [randomNumber, setRandomNumber] = useState(0);
    const isMale = useRef(true);

    const [firstName, setFirstName] = useState<string | undefined>('');
    const [lastName, setLastName] = useState<string | undefined>('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');

    const [userRegistered, setUserRegistered] = useState(false);

    const [wallet, setWallet] = useState<ethers.Wallet>();


    useEffect(() => {
        if (selectedAccount) {
            const newWallet = new ethers.Wallet(selectedAccount.privateKey, provider);
            setWallet(newWallet);
            (async () => {
                setIsLoading(true);
                const user = await getUser(selectedAccount.address);
                if (user) {
                    setUserRegistered(true);
                } else {

                }
                setIsLoading(false);
            })()
        }
    }, [selectedAccount?.address])

    const generateRandomNumber = () => {
        // Generate a random number between 0 and 53 (inclusive)
        const random = Math.floor(Math.random() * 54);
        isMale.current = !isMale.current;
        setRandomNumber(random);
    };

    const validateForm = () => {
        let isValid = true;

        // Validate the first name field
        if (firstName?.trim() === '') {
            setFirstNameError('First Name is required');
            isValid = false;
        } else {
            setFirstNameError('');
        }

        // Validate the last name field
        if (lastName?.trim() === '') {
            setLastNameError('Last Name is required');
            isValid = false;
        } else {
            setLastNameError('');
        }

        return isValid;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        
        if (validateForm()) {
            if (selectedAccount && userContract) {
                try {
                    setIsBusy(true);
                    const user: IUserDto = {
                        firstName: firstName,
                        lastName: lastName,
                        owner: selectedAccount?.address,
                        gender: isMale ? "male" : "female",
                        imageId: randomNumber
                    }
    
                    //const wallet = new ethers.Wallet(selectedAccount.privateKey, provider);
                    const contract = new ethers.Contract(userContract.address, userContract.abi, wallet);
    
                    const results = await addUser(user);
    
                    // Step 1: Call the contract function and receive the transaction response.
                    const txResponse = await (contract as any).registerUser(results._id);
    
                    // Step 2: Wait for the transaction to be mined.
                    const txReceipt = await txResponse.wait(5);
    
                    setIsBusy(false);
                    toast.success('User successfuly registered');
                    dispatch(closeSidePanel({ contentComponent: PanelsEnum.RegisterUserPanel }));

                } catch (error) {
                    toast.error('An error occured');
                }

            }

        }
    };

    return (
        <>
            {isLoading && <div className='flex justify-center items-center mt-20'><Spinner /></div>}
            {!isLoading && userRegistered && <div className='flex justify-center items-center mt-20 text-xl'>User already registered</div>}
            {!isLoading && !userRegistered && <form onSubmit={handleSubmit}>
                <div className='flex flex-col'>

                    <div className='flex justify-center mb-4'> {/* Add justify-center to center the content */}
                        <div className='flex space-x-4'> {/* Add space-x-4 for spacing between image and refresh button */}
                            <img
                                src={`https://xsgames.co/randomusers/assets/avatars/${isMale.current ? "male" : "female"}/${randomNumber}.jpg`}
                                alt="My Image Description"
                                className='h-36 w-36 rounded-full shadow-2xl'
                            />
                            <div className='my-auto'>
                                <FontAwesomeIcon
                                    icon={faRefresh}
                                    className='text-blue-300 text-4xl hover:cursor-pointer'
                                    onClick={() => {
                                        generateRandomNumber();
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='grow'>
                        <FC_Input
                            value={firstName}
                            onChange={(ev) => {
                                setFirstName(ev.target.value);
                            }}
                            placeholder={"First Name"}
                            customClassName="mb-4"
                            error={firstNameError}
                        />
                    </div>
                    <div className='grow'>
                        <FC_Input
                            value={lastName}
                            onChange={(ev) => {
                                setLastName(ev.target.value);
                            }}
                            placeholder={"Last Name"}
                            customClassName="mb-4"
                            error={lastNameError}
                        />
                    </div>
                    {!isBusy && <div className='text-right'>
                        <FC_Button text='Register' type='submit'></FC_Button>
                    </div>}
                    {isBusy &&
                        <div className='flex justify-end pt-2 pr-2'>
                            <Spinner />
                        </div>
                    }
                </div>
            </form>}
        </>

    );
};

export default RegisterUserPanel;