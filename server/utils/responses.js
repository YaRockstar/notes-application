import RequestError from '../constants/errors.js';

export const internalServerResponse = res => {
  return res.status(RequestError.INTERNAL_SERVER_ERROR.status).json({
    error: true,
    message: RequestError.INTERNAL_SERVER_ERROR.message,
  });
};
