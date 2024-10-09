import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRouter.js';
import noteRouter from './routes/noteRouter.js';
import { connectDb } from './db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

app.use('/api', userRouter);
app.use('/api/users/:userId', noteRouter);

const start = () => {
  try {
    connectDb();
    app.listen(PORT, () => {
      console.log(`Server started at port ${PORT}`);
    });
  } catch (error) {
    console.error(`Server error: ${error}`);
  }
};

start();
