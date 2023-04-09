import axios from 'axios';
import { IReward } from '../models/reward';

export const getRewards = async (): Promise<IReward[]> => {
	return (await axios.get(`http://localhost:3000/api/rewards`)).data;
};