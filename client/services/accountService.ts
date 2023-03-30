import axios from 'axios';
import { IAccount } from '../models/account';

export const getAccounts = async (): Promise<IAccount[]> => {
	return (await axios.get(`http://localhost:3000/api/accounts`)).data;
};