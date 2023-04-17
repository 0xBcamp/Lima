import React, { useContext, useEffect, useState } from 'react';
import { FC_Button } from '../form-controls/FC_Button';
import { FC_Input } from '../form-controls/FC_Input';
import { IPropertyForm } from '../../../models/property';
import { FC_TextArea } from '../form-controls/FC_TextArea';
import { ethers } from 'ethers';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import EthersContext from '../../../context/EthersContext';
import { Spinner } from '../Spinner';
import { closeSidePanel } from '../../../store/slices/sidePanelSlice';
import { PanelsEnum } from '@/enums/PanelsEnum';
import { toast } from 'react-toastify';
import { addDummyProperty, getDummyProperties } from '../../../services/propertyService';
import { IDummyProperty } from '../../../models/dummyProperty';

const RegisterPropertyPanel = () => {
    const { provider } = useContext(EthersContext);

    const dispatch = useAppDispatch();

    const selectedAccount = useAppSelector((state) => state.account.selectedAccount);
    const propertyContract = useAppSelector((state) => state.solContract.contracts?.find(x => x.name === "Property"));

    const [propertyData, setPropertyData] = useState<IPropertyForm>({
        imageId: '0',
        name: '',
        location: '',
        description: '',
        pricePerNight: 0,
    });
    const [errors, setErrors] = useState<any>({});

    const [wallet, setWallet] = useState<ethers.Wallet>();
    const [isBusy, setIsBusy] = useState(false);
    const [dummyProperties, setDummyProperties] = useState<IDummyProperty[]>([]);

    useEffect(() => {
        (async () => {
            setDummyProperties(await getDummyProperties());
        })();
    }, [])

    useEffect(() => {
        if (selectedAccount) {
            setWallet(new ethers.Wallet(selectedAccount.privateKey, provider));
        }
    }, [selectedAccount?.address])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setPropertyData({ ...propertyData, [name]: value });
    };

    const handleImageInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        const dummyProperty = dummyProperties.find(x => x.imageId === value);
        if (dummyProperty) {
            setPropertyData(dummyProperty);
        } else {
            setPropertyData({
                imageId: value,
                name: '',
                location: '',
                description: '',
                pricePerNight: 0,
            })
        }
    };

    const validateForm = () => {
        let isValid = true;
        let newErrors = {};

        if (!propertyData.name) {
            isValid = false;
            newErrors = { ...newErrors, name: 'Name is required' };
        }

        if (!propertyData.location) {
            isValid = false;
            newErrors = { ...newErrors, location: 'Location is required' };
        }

        if (!propertyData.description) {
            isValid = false;
            newErrors = { ...newErrors, description: 'Description is required' };
        }

        if (!propertyData.pricePerNight) {
            isValid = false;
            newErrors = { ...newErrors, pricePerNight: 'Price/night is required' };
        }

        setErrors(newErrors);
        return isValid;
    };

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (validateForm() && propertyContract) {
                setIsBusy(true);
                //const wallet = new ethers.Wallet(selectedAccount.privateKey, provider);
                const contract = new ethers.Contract(propertyContract.address, propertyContract.abi, wallet);

                // Step 1: Call the contract function and receive the transaction response.
                const txResponse = await (contract as any).registerProperty(propertyData.name, propertyData.location, "", propertyData.imageId, 0, propertyData.pricePerNight, true, propertyData.description);

                // Step 2: Wait for the transaction to be mined.
                await txResponse.wait();

                await addDummyProperty(propertyData);
                setIsBusy(false);
                toast.success('Property successfuly registered');
                dispatch(closeSidePanel({ contentComponent: PanelsEnum.RegisterPropertyPanel }));
            }
        } catch (error) {
            toast.error('An error occured');
            setIsBusy(false);
        }

    };

    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col">
                <div className="mb-4">
                    <img
                        src={`/properties/${propertyData.imageId ? propertyData.imageId : '0'}.avif`}
                        alt="My Image Description"
                        className="h-auto w-full shadow-2xl"
                    />
                </div>

                <FC_Input
                    label="imageId"
                    onChange={handleImageInputChange}
                    placeholder="imageId"
                    name="imageId"
                    error={errors.imageId}
                    customClassName="mb-4"
                />
                <FC_Input
                    label="Name"
                    value={propertyData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    name="name"
                    error={errors.name}
                    customClassName="mb-4"
                />
                <FC_Input
                    label="Location"
                    value={propertyData.location}
                    onChange={handleInputChange}
                    placeholder="Location"
                    name="location"
                    error={errors.location}
                    customClassName="mb-4"
                />
                <FC_TextArea
                    label="Description"
                    value={propertyData.description}
                    onChange={handleInputChange}
                    placeholder="Enter description"
                    name="description"
                    error={errors.description}
                    customClassName="mb-4"
                />
                <FC_Input
                    label="Price/night"
                    value={propertyData.pricePerNight}
                    onChange={handleInputChange}
                    placeholder="Rates"
                    name="pricePerNight"
                    type="number"
                    error={errors.pricePerNight}
                    customClassName="mb-4"
                />
                {!isBusy && <div className="text-right">
                    <FC_Button text="Register" type="submit"></FC_Button>
                </div>}
                {isBusy &&
                    <div className='flex justify-end pt-2 pr-2'>
                        <Spinner />
                    </div>
                }

            </div>
        </form>
    );
};

export default RegisterPropertyPanel;