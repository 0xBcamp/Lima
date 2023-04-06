import axios from 'axios';
import { IAccount } from '../models/account';

export const reset = async (): Promise<IAccount[]> => {
	return (await axios.post(`http://localhost:3000/api/app/reset`)).data;
};