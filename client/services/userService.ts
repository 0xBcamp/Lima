import axios from 'axios';
import { IUser } from '../models/user';

export const getUsers = async (): Promise<IUser[]> => {
	return (await axios.get(`http://localhost:3000/api/users`)).data;
};