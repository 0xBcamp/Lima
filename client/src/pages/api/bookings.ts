import { NextApiRequest, NextApiResponse } from 'next';
import { Booking, IBooking } from '../../../models/booking';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const bookings: IBooking[] = await Booking.find().populate("user").populate("property");
            return res.status(200).json(bookings);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error fetching bookings' });
        }
    }
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}