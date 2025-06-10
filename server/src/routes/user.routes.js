import express from 'express'
import validate from '../middlewares/validate.js';
import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';
import { getAllUsers, clientRegister, clientLogin, adminLogin, getClientProfile, getAdminProfile, getAllClients } from '../controllers/user.controller.js';
import { ClientRegisterValidation, ClientLoginValidation, AdminLoginValidation, ClientProfileValidation, AdminProfileValidation } from '../middlewares/validation/UserValidation.js';

const router = express.Router();

router.get('/', getAllUsers);
//Client APIS
router.post('/client/register', ClientRegisterValidation, validate, clientRegister);
router.post('/client/login', ClientLoginValidation, validate, clientLogin);
router.get('/client/profile', verifyToken, verifyRole(['client']), ClientProfileValidation, validate, getClientProfile);

//Admin APIS
router.post('/admin/login', AdminLoginValidation, validate, adminLogin);
router.get('/admin/profile', verifyToken, verifyRole(['admin']), AdminProfileValidation, validate, getAdminProfile);
router.get('/admin/clients', verifyToken, verifyRole(['admin']), getAllClients);


export default router;