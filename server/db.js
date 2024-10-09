import mongoose from 'mongoose';
import config from './config/config.json' assert { type: 'json' };

export const connectDb = () => {
  try {
    return mongoose
      .connect(config.connection)
      .then(() => console.log('Connected to MongoDB'))
      .catch(err => console.error('Could not connect to MongoDB', err));
  } catch (error) {
    console.error(`DB error: ${error}`);
  }
};
