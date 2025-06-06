import express from 'express'
import { getAllUsers, clientRegister, clientLogin, adminLogin } from '../controllers/user.controller.js';
import validate from '../middlewares/validate.js';
import { ClientRegisterValidation, ClientLoginValidation, AdminLoginValidation } from '../middlewares/validation/UserValidation.js';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/client/register', ClientRegisterValidation, validate, clientRegister);
router.post('/client/login', ClientLoginValidation, validate, clientLogin);
router.post('/admin/login', AdminLoginValidation, validate, adminLogin);

export default router;