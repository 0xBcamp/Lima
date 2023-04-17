import axios from 'axios';
import { IAccount } from '../models/account';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const reset = async (): Promise<IAccount[]> => {
	return (await axios.post(`${apiUrl}/api/app/reset`)).data;
};