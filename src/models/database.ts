import mongoose, { ConnectOptions } from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect('mongodb://localhost:27017/medicalDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as unknown as ConnectOptions);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Connection to MongoDB failed', err);
  }
};

export default connectDB;
