import { Schema, Document, Types } from 'mongoose';
import mongoose from "mongoose";

// Property Schema and Interface

export interface IProperty extends Document {
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

export interface IPropertyForm {
  _id?: string;
  propertyId?: number;
  owner?: string;
  name?: string;
  location?: string;
  country?: string;
  imageId?: string;
  pricePerNight?: number;
  description?: string;
  user?: Schema.Types.ObjectId;
  bookings?: Types.Array<Types.ObjectId>;
}

const propertySchema = new Schema<IProperty>(
  {
    propertyId: Number,
    owner: String,
    name: String,
    location: String,
    country: String,
    imageId: String,
    pricePerNight: Number,
    description: String,
    user: { type: Types.ObjectId, ref: "User" },
    bookings: [{ type: Types.ObjectId, ref: "Booking", default: [] }],
  }
);

export const Property = mongoose.models.Property || mongoose.model("Property", propertySchema);
