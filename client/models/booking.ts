import { Schema, Document, Types } from 'mongoose';
import mongoose from "mongoose";

export interface IBooking extends Document {
  _id?: string;
  bookingId: number;
  propertyId: number;
  renter: string;
  startDate: string;
  endDate: string;
  totalPrice: string;
  platformFeesAmount: string;
  user: Schema.Types.ObjectId;
  property: Schema.Types.ObjectId;
}

const bookingSchema = new Schema<IBooking>(
  {
    bookingId: Number,
    propertyId: Number,
    renter: String,
    startDate: String,
    endDate: String,
    totalPrice: String,
    platformFeesAmount: String,
    user: { type: Types.ObjectId, ref: "User" },
    property: { type: Types.ObjectId, ref: "Property" },
  }
);

export const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
