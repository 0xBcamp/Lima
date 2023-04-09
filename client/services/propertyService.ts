import axios from 'axios';
import { IProperty } from '../models/property';

export const getProperties = async (): Promise<IProperty[]> => {
	return (await axios.get(`http://localhost:3000/api/properties`)).data;
};