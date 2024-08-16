import ExpensePeriod from '../models/ExpensePeriodSchema.js';
import type { IExpensePeriod } from '../models/ExpensePeriodSchema.js';
import type { IExpense } from '../controllers/expenseController.js';
import Jar from '../models/JarSchema.js';
import type { IExpenseModel } from '../models/ExpenseSchema.js';
import getExpensePeriodBegin from './getExpensePeriodBegin.js';

export const createExpensePeriod = async (expense: IExpense, jarId: string): Promise<IExpenseModel> => {
  try {
    const dateBegin = getExpensePeriodBegin(expense.date);
    const period: IExpensePeriod = new ExpensePeriod({ expenses: [expense], begin: dateBegin, jar: jarId });
    const newPeriod = await period.save();
    await Jar.findOneAndUpdate(
      { _id: jarId },
      { $push: { expensePeriods: newPeriod._id } });

    return newPeriod.expenses[newPeriod.expenses.length - 1];
  } catch (err) {
    return await Promise.reject(err);
  }
};

export const updateExpensePeriod = async (expense: IExpense, jarId: string): Promise<IExpenseModel | null> => {
  try {
    const dateBegin = getExpensePeriodBegin(expense.date);
    const updatePeriod = await ExpensePeriod.findOneAndUpdate(
      { begin: dateBegin, jar: jarId },
      { $push: { expenses: expense } },
      { returnDocument: 'after' });

    if (!updatePeriod) {
      return null;
    }

    return updatePeriod.expenses[updatePeriod.expenses.length - 1];
  } catch (err) {
    return await Promise.reject(err);
  }
};
