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
  firstName: string;
  lastName: string;
}

export interface IPropertyRegisteredEvent {
  propertyId: string;
  owner: string;
  location: string;
  country: string;
  uri: string;
  pricePerNight: string;
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
