import { Schema, Document } from 'mongoose';
import mongoose from "mongoose";

export interface ISolContract extends Document {
  name: string;
  address: string;
  abi: ISolContract_ABI[];
}

export interface ISolContract_ABI {
  type: string;
  name?: string;
  anonymous?: boolean;
  stateMutability: string;
  inputs?: ABI_Function_InputOutput[];
  outputs?: ABI_Function_InputOutput[];
}

export interface ABI_Function_InputOutput {
  internalType: string;
  name?: string;
  type: string;
  value?: any;
}

const solContractSchema = new Schema<ISolContract>(
  {
    name: String,
    address: String,
    abi: Array
  }
);

export const SolContract = mongoose.models.SolContract || mongoose.model("SolContract", solContractSchema);