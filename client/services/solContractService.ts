import axios from 'axios';
import { IAccount } from '../models/account';
import { ISolContract } from '../models/solContract';

export const getSolContracts = async (): Promise<ISolContract[]> => {
	return (await axios.get(`http://localhost:3000/api/contracts`)).data;
};