import { Schema, Document } from 'mongoose';
import mongoose from "mongoose";

export interface IUser extends Document {
  _id?: string;
  firstName: string;
  lastname: string;
  owner: string;
  tokenId: number;
}

const userSchema = new Schema<IUser>(
  {
    firstName: String,
    lastname: String,
    owner: String,
    tokenId: Number,
  }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);