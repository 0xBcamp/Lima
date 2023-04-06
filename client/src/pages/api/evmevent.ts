import { NextApiRequest, NextApiResponse } from 'next';
import { EvmEvent, IEvmEvent, IPropertyRegisteredEvent, IUserRegisteredEvent } from '../../../models/evmEvents';
import { IUser, User } from '../../../models/user';
import { IProperty, Property } from '../../../models/property';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        console.log('POST: evment');
        try {
            const { eventName, contract, blockNumber, transactionHash, eventData } = req.body;

            if (!eventName || !contract || !blockNumber || !transactionHash || !eventData) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Check if the event already exists in the database
            const existingEvent = await EvmEvent.findOne({ transactionHash });
            if (existingEvent) {
                return res.status(409).json({ error: 'Event already exists' });
            }

            const newEvent: IEvmEvent = new EvmEvent({ eventName, contract, blockNumber, transactionHash, eventData });
            await newEvent.save();

            if (eventName === "UserRegistered") {
                const data: IUserRegisteredEvent = eventData
                const newUser: IUser = new User({
                    firstName: data.firstName,
                    lastname: data.lastName,
                    owner: data.owner,
                    tokenId: +data.tokenId
                });
                await newUser.save();
            }

            if (eventName === "PropertyRegistered") {
                const data: IPropertyRegisteredEvent = eventData

                const user = await User.findOne({ owner: data.owner });
                if (!user) {
                    console.log("User not found!");
                    return;
                }

                const newProperty: IProperty = new Property({
                    propertyId: data.propertyId,
                    owner: data.owner,
                    location: data.location,
                    country: data.country,
                    uri: data.uri,
                    pricePerNight: data.pricePerNight,
                    user: user._id,
                });

                await newProperty.save();

                // Update the user with the new property reference
                user.properties.push(newProperty._id);
                await user.save();
            }

            return res.status(201).json(newEvent);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error saving the event' });
        }
    }
    else if (req.method === 'GET') {
        try {
            // Fetch all events from the database
            const events: IEvmEvent[] = await EvmEvent.find().sort({ blockNumber: -1 });

            // Return the events in the response
            return res.status(200).json(events);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error fetching events' });
        }
    }
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}