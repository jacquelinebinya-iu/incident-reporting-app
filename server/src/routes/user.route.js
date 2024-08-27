import express from 'express';

import {
  editProfile,
  fetchUserById,
  updateUserRole,
} from '../controllers/Users/user.controller.js';
import { ENUM_USER_ROLES} from '../helpers/constants.js';
import { verifyByRole } from '../helpers/middleware/role.middleware.js';

const router = express.Router();


router.get('/:id', fetchUserById);
router.post('/profile', editProfile);
router.post('/', verifyByRole([ENUM_USER_ROLES.ADMIN]), updateUserRole);

export default router;
