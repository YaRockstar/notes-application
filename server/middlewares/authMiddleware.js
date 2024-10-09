import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import RequestError from '../constants/errors.js';

dotenv.config();

/**
 * Проверка токена доступа.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const authMiddleware = (req, res, next) => {
  const token = req.headers?.authorization?.split(' ')[1];

  if (!token) {
    return res.sendStatus(RequestError.UNAUTHORIZED.status);
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(RequestError.UNAUTHORIZED.status);
    }

    req.user = user;
    next();
  });
};
