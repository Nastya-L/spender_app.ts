import type mongoose from 'mongoose';
import type { IExpenseModel } from '../models/ExpenseSchema.js';

export interface IExpenseToFE {
  _id: mongoose.Types.ObjectId
  value: number
  category: string
  owner: mongoose.Types.ObjectId
  date: Date
};

const expenseMapper = (expense: IExpenseModel): IExpenseToFE => {
  return {
    _id: expense._id,
    value: expense.value,
    category: expense.category,
    owner: expense.owner,
    date: expense.date
  };
};

export default expenseMapper;
