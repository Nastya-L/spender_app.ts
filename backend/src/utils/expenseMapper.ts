import type mongoose from 'mongoose';
import type { IExpenseModel } from '../models/ExpenseSchema.js';
import type { IUserToFE } from './userMapper.js';

export interface IExpenseOwner {
  _id: mongoose.Types.ObjectId
  firstName: string
}

export interface IExpenseToFE {
  _id: mongoose.Types.ObjectId
  value: number
  category: string
  owner: IExpenseOwner
  date: Date
};

const expenseWithUserMapper = (expense: IExpenseModel, user: IUserToFE): IExpenseToFE => {
  return {
    _id: expense._id,
    value: expense.value,
    category: expense.category,
    owner: {
      _id: expense.owner,
      firstName: user.firstName
    },
    date: expense.date
  };
};

export default expenseWithUserMapper;
