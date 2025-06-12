import express from 'express';
import validate from '../middlewares/validate.js';
import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';
import { generateApiKey } from '../controllers/apikey.controller.js';
import { generateApiKeyValidation } from '../middlewares/validation/ApiKeyValidation.js';

const router = express.Router();

// API Key Routes
router.post('/:clientId', verifyToken, verifyRole(['admin']), generateApiKeyValidation, validate, generateApiKey);

export default router;
