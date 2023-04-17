import axios from 'axios';
import { IReward } from '../models/reward';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getRewards = async (): Promise<IReward[]> => {
	return (await axios.get(`${apiUrl}/api/rewards`)).data;
};