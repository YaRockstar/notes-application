import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Создание токена доступа.
 * @param {*} user
 * @param {*} expiresIn
 * @returns
 */
export const createAccessToken = (user, expiresIn = '24h') => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
    },
    process.env.SECRET_KEY,
    { expiresIn }
  );
};
