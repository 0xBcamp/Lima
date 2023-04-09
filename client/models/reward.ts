import { Schema, Document, Types } from 'mongoose';
import mongoose from "mongoose";

export interface IReward extends Document {
  _id?: string;
  user: string;
  points: number;
  month: number;
  description: string;
  userObj: Schema.Types.ObjectId;
}

const rewardSchema = new Schema<IReward>(
  {
    user: String,
    points: Number,
    month: Number,
    description: String,
    userObj: { type: Types.ObjectId, ref: "User" },
  }
);

export const Reward = mongoose.models.Reward || mongoose.model("Reward", rewardSchema);
