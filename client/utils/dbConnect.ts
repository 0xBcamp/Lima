import { Db, MongoClient } from 'mongodb';
import mongoose from 'mongoose';

let uri = process.env.MONGODB_URI;
const password = process.env.MONGODB_PASSWORD;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const encodedPassword = encodeURIComponent(password!);
uri = uri.replace("password", encodedPassword);

let cachedClient: MongoClient;
let cachedDb: Db;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!mongoose.connection.readyState) {
    await mongoose.connect(uri as string, {});
  }

  const client = await MongoClient.connect(uri as string, {});

  const db = client.db();

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}