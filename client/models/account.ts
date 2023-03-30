import { Schema, model, Document } from 'mongoose';
import mongoose from "mongoose";

export interface IAccount extends Document {
  address: string;
  privateKey: string;
  name: string;
  index: number;
}

const accountSchema = new Schema<IAccount>(
  {
    address: String,
    privateKey: String,
    name: String,
    index: Number
  }
);

export const Account = mongoose.models.Account || mongoose.model("Account", accountSchema);