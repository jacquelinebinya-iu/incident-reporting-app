import express from 'express';

import {
  loginController,
  logoutController,
} from '../../controllers/Admin/admin.auth.controller.js';
import { loginValidationRules } from '../../helpers/validators/auth.validators.js';
import { validate } from '../../helpers/validators/validation.js';

const router = express.Router();

router.post('/login', loginValidationRules(), validate, loginController);
router.get('/logout', logoutController);

export default router;
