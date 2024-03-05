import express from 'express';
import authorizationController from '../controllers/authorizationController.js';
import authorizationValidator from '../validators/authorizationValidator.js';

const authorizationRouters = express.Router();

authorizationRouters.post('/', authorizationValidator, authorizationController);

export default authorizationRouters;
