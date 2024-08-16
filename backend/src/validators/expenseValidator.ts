import { body } from 'express-validator';
import { ExpenseCategory } from '../models/ExpenseSchema.js';

const expenseValidator = [
  body('value')
    .exists({ checkFalsy: true })
    .withMessage('Sum is required')
    .isNumeric(),
  body('category')
    .exists({ checkFalsy: true })
    .withMessage('Category is required')
    .isIn(Object.values(ExpenseCategory))
    .withMessage('Invalid category')
    .isString(),
  body('date')
    .exists({ checkFalsy: true })
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be a valid date in ISO8601 format')
];

export default expenseValidator;
