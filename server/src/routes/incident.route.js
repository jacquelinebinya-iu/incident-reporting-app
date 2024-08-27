import express from 'express';

import {
  createIncident,
  editIncident,
  fetchCategories,
  fetchIncidentById, fetchSeverityOptions,
  incidents,
} from '../controllers/Incidents/incident.controller.js';
import { ENUM_USER_ROLES } from '../helpers/constants.js';
import { verifyByRole } from '../helpers/middleware/role.middleware.js';
import { createIncidentValidationRules } from '../helpers/validators/incident.validators.js';
import { validate } from '../helpers/validators/validation.js';

const router = express.Router();

// router.get('/', verifyByRole([ROLES_ENUM.ADMIN, ROLES_ENUM.STAFF]), incidents );
router.get('/', incidents);
router.get('/categories', fetchCategories);
router.get('/severity/options', fetchSeverityOptions);
router.post(
  '/',
  verifyByRole(`${ENUM_USER_ROLES.STUDENT}`),
  createIncidentValidationRules(),
  validate,
  createIncident
);
router.patch('/:id', verifyByRole(`${ENUM_USER_ROLES.STUDENT}`), validate, editIncident);
router.get('/:id', fetchIncidentById);
// router.post('/assign',  verifyByRole([ROLES_ENUM.ADMIN]) )

export default router;
