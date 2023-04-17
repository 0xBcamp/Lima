import { NextApiRequest, NextApiResponse } from 'next';
import { IUser, User } from '../../../models/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const owner = req.query.owner;

            if (owner) {
                const user = await User.findOne({ owner: owner })
                    .populate({
                        path: 'properties',
                        populate: [
                            {
                                path: 'bookings',
                                model: 'Booking', // Replace with the appropriate model name for bookings
                                populate: {
                                    path: 'user',
                                    model: 'User' // Replace with the appropriate model name for users
                                }
                            }
                        ]
                    })
                    .populate({
                        path: 'bookings',
                        populate: {
                            path: 'property',
                            model: 'Property' // Replace with the appropriate model name for properties
                        }
                    })
                    .populate('rewards');
                if (user) {
                    return res.status(200).json(user);
                } else {
                    return res.status(200).json(undefined);
                }
            } else {
                const users: IUser[] = await User.find().populate('properties').populate('rewards');
                return res.status(200).json(users);
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error fetching users' });
        }
    } else if (req.method === 'POST') {
        try {
            const data = req.body;

            if (!data.owner) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const user = await User.findOne({ owner: data.owner });
            if (user) {
                console.log("User already registered!");
                return res.status(201).json(user);
            }

            const newUser: IUser = new User({
                firstName: data.firstName,
                lastName: data.lastName,
                owner: data.owner,
                gender: data.gender,
                imageId: +data.imageId
            });

            await newUser.save();
            return res.status(201).json(newUser);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error creating user' });
        }
    }
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}