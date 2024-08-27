import { body } from 'express-validator';

const registerValidationRules = () => {
  return [
    body('email').isEmail().withMessage('Email is invalid'),
    body('name').not().isEmpty().trim().escape().withMessage('First name is required'),
    body('surname').not().isEmpty().trim().escape().withMessage('Surname is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ];
};

const loginValidationRules = () => {
  return [
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').not().isEmpty().trim().escape().withMessage('Password is required'),
  ];
};

export { loginValidationRules, registerValidationRules };
