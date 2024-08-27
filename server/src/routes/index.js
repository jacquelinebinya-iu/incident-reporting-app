import express from 'express';

import { fetchCurrentUser } from '../controllers/Users/user.controller.js';
import { authenticate } from '../helpers/middleware/auth.middleware.js';
import adminRoutes from './admin/index.js';
import authRoutes from './auth.route.js';
import incidentRoutes from './incident.route.js';
import userRoutes from './user.route.js';

const router = express.Router();

router.get('/current', authenticate, fetchCurrentUser);
router.use('/admin', adminRoutes);

router.use('/auth', authRoutes);
router.use('/users', authenticate, userRoutes);
router.use('/incidents', authenticate, incidentRoutes);

export default router;
