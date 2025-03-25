import type mongoose from 'mongoose';
import { type IExpenseModel } from '../models/ExpenseSchema.js';
import { type IJar } from './getAllExpensesFromJar.js';

interface Pagination {
  page: number
  limit: number | undefined
  totalExpenses: number
  totalPages: number
}

interface JarWithPagination {
  _id: mongoose.Types.ObjectId
  name: string
  color: string
  users: [mongoose.Types.ObjectId]
  owner: mongoose.Types.ObjectId
  expenses: IExpenseModel[]
}

interface JarWithPaginatedExpensesResponse {
  jar: JarWithPagination
  pagination: Pagination
}

const jarWithPaginatedExpensesMapper = (jar: IJar, pagination: Pagination): JarWithPaginatedExpensesResponse => {
  return {
    jar: {
      _id: jar._id,
      name: jar.name,
      color: jar.color,
      owner: jar.owner,
      users: jar.users,
      expenses: jar.expenses
    },
    pagination: {
      page: pagination.page,
      totalPages: pagination.totalPages,
      limit: pagination.limit,
      totalExpenses: pagination.totalExpenses
    }
  };
};

export default jarWithPaginatedExpensesMapper;
