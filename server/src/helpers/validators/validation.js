import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const errorMessage = errors.array().map((el) => el.msg);

  console.log('🔴🔴🔴🔴', errors);
  return res.status(400).json({
    success: false,
    errorMessage,
  });
};
