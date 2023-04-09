import { Schema, Document, Types } from 'mongoose';
import mongoose from "mongoose";

export interface IReview extends Document {
  _id?: string;
  reviewer: string;
  propertyId: number;
  bookingId: number;
  review: {
    rating: number;
    comment: string;
    timestamp: Date;
  };
}

const reviewSchema = new Schema<IReview>(
  {
    reviewer: String,
    propertyId: Number,
    bookingId: Number,
    review: {
      rating: Number,
      comment: String,
      timestamp: Date,
    },
  }
);

export const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
