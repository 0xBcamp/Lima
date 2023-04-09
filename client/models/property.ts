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
  uri: string;
  pricePerNight: number;
  user: Schema.Types.ObjectId;
  bookings: Types.Array<Types.ObjectId>;
}

const propertySchema = new Schema<IProperty>(
  {
    propertyId: Number,
    owner: String,
    name: String,
    location: String,
    country: String,
    uri: String,
    pricePerNight: Number,
    user: { type: Types.ObjectId, ref: "User" },
    bookings: [{ type: Types.ObjectId, ref: "Booking", default: [] }],
  }
);

export const Property = mongoose.models.Property || mongoose.model("Property", propertySchema);
