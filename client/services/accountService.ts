import axios from 'axios';
import { IAccount } from '../models/account';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getAccounts = async (): Promise<IAccount[]> => {
	return (await axios.get(`${apiUrl}/api/accounts`)).data;
};