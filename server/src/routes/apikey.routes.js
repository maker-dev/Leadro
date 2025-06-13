import express from 'express';
import validate from '../middlewares/validate.js';
import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';
import { generateApiKey, toggleApiKeyStatus, regenerateApiKey } from '../controllers/apikey.controller.js';
import { generateApiKeyValidation, toggleApiKeyStatusValidation, regenerateApiKeyValidation } from '../middlewares/validation/ApiKeyValidation.js';

const router = express.Router();

// API Key Routes
router.post('/:clientId', verifyToken, verifyRole(['admin']), generateApiKeyValidation, validate, generateApiKey);
router.patch('/:apiKeyId', verifyToken, verifyRole(['admin']), toggleApiKeyStatusValidation, validate, toggleApiKeyStatus);
router.patch('/:apiKeyId/regenerate', verifyToken, verifyRole(['admin']), regenerateApiKeyValidation, validate, regenerateApiKey);

export default router;
