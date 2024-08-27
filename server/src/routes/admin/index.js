import express from 'express';

import { validateUserAccess } from '../../helpers/middleware/access.middleware.js';
import { authenticate } from '../../helpers/middleware/auth.middleware.js';
import adminRoutes from './admin.route.js';
import authAdminRoutes from './auth.route.js';
import userAdminRoutes from './user.route.js';

const adminRouter = express.Router();

adminRouter.use(authAdminRoutes);
adminRouter.use(authenticate);
adminRouter.use(validateUserAccess);
adminRouter.use(userAdminRoutes);
adminRouter.use(adminRoutes);

export default adminRouter;
