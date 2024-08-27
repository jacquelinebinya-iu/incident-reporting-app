import express from 'express';

import {
  assignAdminToIncident,
  blockAdmin, closeIncidentStatus,
  getAllAdmins,
  inviteAdmin,
  updateIncidentStatus,
} from '../../controllers/Admin/admin.controller.js';
import { fetchMetrics } from '../../controllers/Dashboard/dashboard.controller.js';
import { ENUM_USER_ROLES } from '../../helpers/constants.js';
import { verifyByRole } from '../../helpers/middleware/role.middleware.js';

const router = express.Router();
// Admin Routes
router.get(
  '/manage-admins',
  verifyByRole([ENUM_USER_ROLES.SUPER_ADMIN, ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPPORT]),
  getAllAdmins
);
router.get('/metrics', fetchMetrics);
router.post(
  '/invite-admin',
  verifyByRole([ENUM_USER_ROLES.SUPER_ADMIN, ENUM_USER_ROLES.ADMIN]),
  inviteAdmin
);
router.post(
  '/block',
  verifyByRole([ENUM_USER_ROLES.SUPER_ADMIN, ENUM_USER_ROLES.ADMIN]),
  blockAdmin
);
router.patch(
  '/incidents/close/:id',
  verifyByRole([ENUM_USER_ROLES.SUPER_ADMIN, ENUM_USER_ROLES.ADMIN]),
  closeIncidentStatus
);
router.patch('/assign/:id', assignAdminToIncident);
router.patch(
  '/incidents/update-status/:id',
  verifyByRole([ENUM_USER_ROLES.SUPER_ADMIN, ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPPORT]),
  updateIncidentStatus
);

export default router;
