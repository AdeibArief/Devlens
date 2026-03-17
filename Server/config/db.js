import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.MONGO_URI)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Connection terminated im sorry to interrupt you elizabeth:', error.message);
    process.exit(1);
  }
};

export default connectDB;