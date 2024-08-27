import 'dotenv/config';

import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      errorMessage: 'Access Denied. No access token provided.',
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      errorMessage: 'Access Denied. Malformed authorization header.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    console.log(':::::user:::middleware', req.user);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      errorMessage: 'Access Denied. Invalid Token.',
    });
  }
};
