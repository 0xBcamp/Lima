import axios from 'axios';
import { IBooking } from '../models/booking';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getBookings = async (): Promise<IBooking[]> => {
	return (await axios.get(`${apiUrl}/api/bookings`)).data;
};