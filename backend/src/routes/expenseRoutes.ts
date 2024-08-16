import express from 'express';
import getUserFromToken from '../middleware/getUserFromToken.js';
import { createExpense } from '../controllers/expenseController.js';
import expenseValidator from '../validators/expenseValidator.js';

const expenseRouter = express.Router();

expenseRouter.use(getUserFromToken);

expenseRouter.get('/');

expenseRouter.post('/jar/:id/expense', expenseValidator, createExpense);

expenseRouter.put('/:id');

expenseRouter.delete('/:id');

export default expenseRouter;
