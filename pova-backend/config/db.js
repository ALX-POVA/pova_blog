// config/db.js

import { MongoClient }  from 'mongodb';
import dotenv from 'dotenv';
dotenv.config()

const client = new MongoClient(process.env.MONGODB_URI);

// Connects to Mongo database
const connectDB = async() => {
  try {
    await client.connect();
    console.log('MongoDB connected...');
  } catch (err) {
    console.log(`MongoDB client not connected: ${err}`);
    process.exit(1);
  }
}

const db = client.db(process.env.DATABASE || "povaDB");
export { connectDB, client, db};