import { NextApiRequest, NextApiResponse } from 'next';
import { EvmEvent, IBookingCreatedEvent, IEvmEvent, IMessageSentEvent, IPropertyRegisteredEvent, IReviewSubmittedEvent, IUserPointsAddedEvent, IUserRegisteredEvent, UserPointType } from '../../../models/evmEvents';
import { IUser, User } from '../../../models/user';
import { IProperty, Property } from '../../../models/property';
import { Booking, IBooking } from '../../../models/booking';
import { IReward, Reward } from '../../../models/reward';
import { IMessage, Message } from '../../../models/message';
import { IReview, Review } from '../../../models/review';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { eventName, contract, blockNumber, transactionHash, eventData } = req.body;

            if (!eventName || !contract || !blockNumber || !transactionHash || !eventData) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Check if the event already exists in the database
            const existingEvent = await EvmEvent.findOne({ transactionHash, eventName });
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
                console.log('data :>> ', data);
                const user = await User.findOne({ owner: data.owner });
                if (!user) {
                    console.log("User not found!");
                    return;
                }

                const newProperty: IProperty = new Property({
                    propertyId: data.propertyId,
                    owner: data.owner,
                    name: data.name,
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

            if (eventName === "BookingCreated") {
                const data: IBookingCreatedEvent = eventData;

                // Find the user by renter's address
                const user = await findUserWithRetry(data.renter);
                if (!user) {
                    console.log("User not found!");
                    return;
                }

                // Find the property by propertyId
                const property = await Property.findOne({ propertyId: +data.propertyId });
                if (!property) {
                    console.log("Property not found!");
                    return;
                }

                const newBooking: IBooking = new Booking({
                    bookingId: +data.bookingId,
                    propertyId: +data.propertyId,
                    renter: data.renter,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    user: user._id,
                    property: property._id,
                });
                await newBooking.save();

                // Update the user with the new booking reference
                user.bookings.push(newBooking._id);
                await user.save();

                // Update the property with the new booking reference
                property.bookings.push(newBooking._id);
                await property.save();
            }

            if (eventName === "UserPointsAdded") {
                const data: IUserPointsAddedEvent = eventData;

                // Find the user by renter's address
                const user = await User.findOne({ owner: data.user });
                if (!user) {
                    console.log("User not found!");
                    return;
                }

                const newReward: IReward = new Reward({
                    user: data.user,
                    points: +data.points,
                    month: +data.month,
                    description: UserPointType[+data.pointType],
                    userObj: user._id,
                });
                await newReward.save();

                // Update the user with the new reward reference
                user.rewards.push(newReward._id);
                await user.save();
            }

            if (eventName === "MessageSent") {
                const data: IMessageSentEvent = eventData;
                const newMessage: IMessage = new Message({
                    bookingId: +data.bookingId,
                    sender: data.sender,
                    content: data.content,
                    timestamp: data.timestamp, // Convert UNIX timestamp to Date
                });
                await newMessage.save();
            }

            if (eventName === "ReviewSubmitted") {
                const data: IReviewSubmittedEvent = eventData;
                const newReview: IReview = new Review({
                    reviewer: data.reviewer,
                    propertyId: +data.propertyId,
                    bookingId: +data.bookingId,
                    review: {
                        rating: +data.review.rating,
                        comment: data.review.comment,
                        timestamp: data.review.timestamp, // Convert UNIX timestamp to Date
                    },
                });
                await newReview.save();
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

    async function findUserWithRetry(address: string, maxRetries = 5, delay = 1000) {
        let retryCount = 0;
      
        while (retryCount < maxRetries) {
          const user = await User.findOne({ owner: address });
      
          if (user) {
            return user;
          }
      
          // Wait for the specified delay before the next retry
          await new Promise((resolve) => setTimeout(resolve, delay));
          retryCount++;
        }
      
        console.log("User not found after all retries!");
        return null;
      }
}