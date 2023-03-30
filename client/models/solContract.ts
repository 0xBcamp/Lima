import { Schema, Document } from 'mongoose';
import mongoose from "mongoose";

export interface ISolContract extends Document {
  name: string;
  address: string;
  abi: string;
}

const solContractSchema = new Schema<ISolContract>(
  {
    name: String,
    address: String,
    abi: Array
  }
);

export const SolContract = mongoose.models.SolContract || mongoose.model("SolContract", solContractSchema);