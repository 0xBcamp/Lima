import axios from 'axios';
import { IBooking } from '../models/booking';

export const getBookings = async (): Promise<IBooking[]> => {
	return (await axios.get(`http://localhost:3000/api/bookings`)).data;
};