import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const { DB_HOST, DB_PORT, DB_NAME } = process.env;

if (!DB_HOST || !DB_PORT || !DB_NAME) {
  throw new Error("Missing MongoDB environment variables");
}

const mongoURI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoURI);
    console.log(`✅ Connected to MongoDB database`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); 
  }
};
