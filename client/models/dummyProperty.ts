import { Schema, Document, Types } from 'mongoose';
import mongoose from "mongoose";

// Property Schema and Interface

export interface IDummyProperty extends Document {
  _id?: string;
  propertyId: number;
  owner: string;
  name: string;
  location: string;
  country: string;
  imageId: string;
  pricePerNight: number;
  description: string;
  user: Schema.Types.ObjectId;
  bookings: Types.Array<Types.ObjectId>;
}

export interface IDummyPropertyForm {
  _id?: string;
  propertyId?: number;
  owner?: string;
  name?: string;
  location?: string;
  country?: string;
  imageId?: string;
  pricePerNight?: number;
  description?: string;
}

const dummyPropertySchema = new Schema<IDummyProperty>(
  {
    propertyId: Number,
    owner: String,
    name: String,
    location: String,
    country: String,
    imageId: String,
    pricePerNight: Number,
    description: String,
  }
);

export const DummyProperty = mongoose.models.DummyProperty || mongoose.model("DummyProperty", dummyPropertySchema);
