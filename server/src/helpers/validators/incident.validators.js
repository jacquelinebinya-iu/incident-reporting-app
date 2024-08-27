import { body } from 'express-validator';

const createIncidentValidationRules = () => {
  return [
    body('category').not().isEmpty().trim().escape().withMessage('Catergory is required'),
    body('title').not().isEmpty().trim().escape().withMessage('Title is required'),
    body('description').not().isEmpty().trim().escape().withMessage('Description is required'),
    body('incidentDate').not().isEmpty().trim().escape().withMessage('Incident date is required'),
  ];
};

export { createIncidentValidationRules };
