import { Schema, model, Document } from 'mongoose';
import mongoose from "mongoose";

export interface IEvmEvent extends Document {
  eventName: string;
  contract: string;
  blockNumber: string;
  transactionHash: string;
  eventData: {
    [key: string]: any;
  };
}

export interface IUserRegisteredEvent {
  owner: string;
  tokenId: string;
  tokenUri: string;
}

export interface IPropertyRegisteredEvent {
  propertyId: string;
  owner: string;
  name: string;
  location: string;
  country: string;
  imageId: string;
  pricePerNight: string;
  description: string;
}

export interface IBookingCreatedEvent {
  bookingId: string;
  propertyId: string;
  renter: string;
  startDate: string;
  endDate: string;
  totalPrice: string;
  platformFeesAmount: string;
}

export enum UserPointType {
  UserRegistered,
  PropertyRegistered,
  ReviewSubmitted,
  BookingCreated,
  BookingReceived
}

export interface IUserPointsAddedEvent {
  user: string;
  points: string;
  month: string;
  pointType: string;
}

export interface IRewardWithdrawnEvent {
  user: string;
  amount: string;
  month: string;
}

export interface IMessageSentEvent {
  bookingId: string;
  sender: string;
  content: string;
  timestamp: string;
}

export interface IBookingReview {
  rating: string;
  comment: string;
  timestamp: string;
}

export interface IReviewSubmittedEvent {
  reviewer: string;
  propertyId: string;
  bookingId: string;
  review: IBookingReview;
}

const evmEventSchema = new Schema<IEvmEvent>(
  {
    eventName: {
      type: String,
      required: true,
    },
    contract: {
      type: String,
      required: true,
    },
    blockNumber: {
      type: String,
      required: true,
    },
    transactionHash: {
      type: String,
      required: true,
    },
    eventData: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  }
);

export const EvmEvent = mongoose.models.EvmEvent || mongoose.model("EvmEvent", evmEventSchema);
