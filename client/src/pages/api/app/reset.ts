import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../../../models/user';
import { EvmEvent } from '../../../../models/evmEvents';
import { Property } from '../../../../models/property';
import { Booking } from '../../../../models/booking';
import { Message } from '../../../../models/message';
import { Review } from '../../../../models/review';
import { Reward } from '../../../../models/reward';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            await EvmEvent.deleteMany({});

            await Booking.deleteMany({});
            await Message.deleteMany({});
            await Property.deleteMany({});
            await Review.deleteMany({});
            await Reward.deleteMany({});
            await User.deleteMany({});

            return res.status(201).json(true);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error saving the event' });
        }
    }
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}