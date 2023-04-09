import { NextApiRequest, NextApiResponse } from 'next';
import { Booking, IBooking } from '../../../models/booking';
import { IReward, Reward } from '../../../models/reward';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const rewards: IReward[] = await Reward.find().populate("userObj");
            return res.status(200).json(rewards);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error fetching rewards' });
        }
    }
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}