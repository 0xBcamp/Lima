import axios from 'axios';
import { IAccount } from '../models/account';
import { ISolContract } from '../models/solContract';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getSolContracts = async (): Promise<ISolContract[]> => {
	return (await axios.get(`${apiUrl}/api/contracts`)).data;
};