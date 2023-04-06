import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../../../models/user';
import { EvmEvent } from '../../../../models/evmEvents';
import { Property } from '../../../../models/property';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            await User.deleteMany({});
            await EvmEvent.deleteMany({});
            await Property.deleteMany({});

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