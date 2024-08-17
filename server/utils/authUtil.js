import jwt from 'jsonwebtoken';

const authenticateJwtToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const jwtToken = authHeader?.split(' ')[1];

  if (!jwtToken) {
    return res.sendStatus(401);
  }

  jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return sendStatus(401);
    }
    req.user = user;
    next();
  });
};

export default authenticateJwtToken;