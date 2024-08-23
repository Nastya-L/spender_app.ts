import express from 'express';
import getUserFromToken from '../middleware/getUserFromToken.js';
import { createExpense, deleteExpense, getExpense, updateExpense } from '../controllers/expenseController.js';
import expenseValidator from '../validators/expenseValidator.js';

const expenseRouter = express.Router();

expenseRouter.use(getUserFromToken);

expenseRouter.get('/jar/:id/expense', getExpense);

expenseRouter.post('/jar/:id/expense', expenseValidator, createExpense);

expenseRouter.put('/jar/:jarId/expense/:expenseId', expenseValidator, updateExpense);

expenseRouter.delete('/jar/:jarId/expense/:expenseId', deleteExpense);

export default expenseRouter;
