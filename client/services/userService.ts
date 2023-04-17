import axios from 'axios';
import { IUser, IUserDto } from '../models/user';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getUsers = async (): Promise<IUser[]> => {
	return (await axios.get(`${apiUrl}/api/users`)).data;
};

export const getUser = async (owner: string): Promise<IUser> => {
	return (await axios.get(`${apiUrl}/api/users?owner=${owner}`)).data;
};

export const addUser = async (user: IUserDto) => {
	return (await axios.post(`${apiUrl}/api/users`, user)).data;
};