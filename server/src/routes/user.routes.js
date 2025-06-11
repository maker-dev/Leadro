import express from 'express'
import validate from '../middlewares/validate.js';
import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';
import { clientRegister, clientLogin, adminLogin, getProfile, getAllClients, clientVerifyEmail, resendVerificationEmail } from '../controllers/user.controller.js';
import { ClientRegisterValidation, ClientLoginValidation, AdminLoginValidation, ProfileValidation, ResendVerificationEmailValidation } from '../middlewares/validation/UserValidation.js';

const router = express.Router();

//Client APIS
router.post('/client/register', ClientRegisterValidation, validate, clientRegister);
router.get('/client/verify-email', clientVerifyEmail);
router.post('/client/resend-verification', ResendVerificationEmailValidation, validate, resendVerificationEmail);
router.post('/client/login', ClientLoginValidation, validate, clientLogin);

//Profile API (unified for both client and admin)
router.get('/profile', verifyToken, ProfileValidation, validate, getProfile);

//Admin APIS
router.post('/admin/login', AdminLoginValidation, validate, adminLogin);
router.get('/admin/clients', verifyToken, verifyRole(['admin']), getAllClients);

export default router;