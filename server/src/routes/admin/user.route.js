import express from 'express';

import { blockUser, getAllUsers } from '../../controllers/Users/user.controller.js';
import { ENUM_USER_ROLES } from '../../helpers/constants.js';
import { verifyByRole } from '../../helpers/middleware/role.middleware.js';

const router = express.Router();
// User Routes
router.get(
  '/users',
  verifyByRole([ENUM_USER_ROLES.SUPER_ADMIN, ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPPORT]),
  getAllUsers
);
router.patch(
  '/users/block/:id',
  verifyByRole([ENUM_USER_ROLES.SUPER_ADMIN, ENUM_USER_ROLES.ADMIN]),
  blockUser
);

export default router;
