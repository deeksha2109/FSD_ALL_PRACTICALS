import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rentalhub';
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    dbName: uri.split('/').pop(),
  });
  console.log('MongoDB connected');
};
