import express from 'express';
import { authorizationController, forgotPassword, resetPassword } from '../controllers/authorizationController.js';
import authorizationValidator from '../validators/authorizationValidator.js';

const authorizationRouters = express.Router();

authorizationRouters.post('/login', authorizationValidator, authorizationController);

authorizationRouters.post('/forgot-password', forgotPassword);

authorizationRouters.post('/reset-password', resetPassword);

export default authorizationRouters;
