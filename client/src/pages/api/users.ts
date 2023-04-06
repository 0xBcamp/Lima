import { NextApiRequest, NextApiResponse } from 'next';
import { IUser, User } from '../../../models/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const users: IUser[] = await User.find();
            return res.status(200).json(users);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error fetching users' });
        }
    }
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}