import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import authenticateJwtToken from './utils/authUtil.js';
import userModel from './models/user.model.js';
import config from './config.json' assert { type: 'json' };

dotenv.config();
mongoose.connect(config.connectionString);

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: '*',
  })
);

app.get('/', (req, res) => {
  res.json({ data: 'Hello, world!' });
});

app.post('/create-account', async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email) {
    return res.status(400).json({ error: true, message: 'Необходима почта' });
  }

  if (!password) {
    return res.status(400).json({ error: true, message: 'Необходим пароль' });
  }

  if (!fullName) {
    return res.status(400).json({ error: true, message: 'Необходимо полное имя' });
  }

  const user = await userModel.findOne({ email: email });

  if (user) {
    return res.json({ error: true, message: 'Пользователь уже существует' });
  }

  const newUser = new userModel({
    email,
    password,
    fullName,
  });

  await newUser.save();

  const accessToken = jwt.sign({ newUser }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '36000m',
  });

  return res.json({
    error: false,
    newUser,
    accessToken,
    message: 'Регистрация прошла успешно',
  });
});

app.listen(PORT);

export default app;
