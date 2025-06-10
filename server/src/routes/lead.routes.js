import express from 'express';
import { createLead, getClientLeads } from '../controllers/lead.controller.js';
import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';
import validate from '../middlewares/validate.js';
import { CreateLeadValidation } from '../middlewares/validation/LeadValidation.js';

const router = express.Router();

router.post('/', verifyToken, verifyRole(['client']), CreateLeadValidation, validate, createLead);
router.get('/', verifyToken, verifyRole(['client']), getClientLeads);

export default router;