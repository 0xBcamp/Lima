import { Schema, Document, Types } from 'mongoose';
import mongoose from "mongoose";

export interface IMessage extends Document {
  _id?: string;
  bookingId: number;
  sender: string;
  content: string;
  timestamp: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    bookingId: Number,
    sender: String,
    content: String,
    timestamp: Date,
  }
);

export const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
