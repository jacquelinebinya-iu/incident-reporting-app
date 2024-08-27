import express from 'express';

import {
  loginController,
  logoutController,
  registerController,
  resetPasswordController,
} from '../controllers/Auth/auth.controller.js';
import {
  loginValidationRules,
  registerValidationRules,
} from '../helpers/validators/auth.validators.js';
import { validate } from '../helpers/validators/validation.js';

const router = express.Router();

router.post('/register', registerValidationRules(), validate, registerController);
router.post('/login', loginValidationRules(), validate, loginController);
router.post('/reset-password', loginValidationRules(), validate, resetPasswordController);
router.get('/logout', logoutController);

export default router;
