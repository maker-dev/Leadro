import express from 'express';
import { createLead, getClientLeads, updateLead, deleteLead } from '../controllers/lead.controller.js';
import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';
import validate from '../middlewares/validate.js';
import { CreateLeadValidation, UpdateLeadValidation, DeleteLeadValidation } from '../middlewares/validation/LeadValidation.js';

const router = express.Router();

router.post('/', verifyToken, verifyRole(['client']), CreateLeadValidation, validate, createLead);
router.get('/', verifyToken, verifyRole(['client']), getClientLeads);
router.put('/:id', verifyToken, verifyRole(['client']), UpdateLeadValidation, validate, updateLead);
router.delete('/:id', verifyToken, verifyRole(['client']), DeleteLeadValidation, validate, deleteLead);

export default router;