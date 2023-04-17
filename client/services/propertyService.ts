import axios from 'axios';
import { IProperty } from '../models/property';
import { IDummyProperty, IDummyPropertyForm } from '../models/dummyProperty';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getProperties = async (): Promise<IProperty[]> => {
	return (await axios.get(`${apiUrl}/api/properties`)).data;
};

export const getDummyProperties = async (): Promise<IDummyProperty[]> => {
	return (await axios.get(`${apiUrl}/api/dummyproperties`)).data;
};

export const addDummyProperty = async (property: IDummyPropertyForm): Promise<IDummyProperty[]> => {
	return (await axios.post(`${apiUrl}/api/dummyproperties`, property)).data;
};