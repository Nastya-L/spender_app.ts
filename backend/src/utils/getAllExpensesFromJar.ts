import Jar from '../models/JarSchema.js';
import type mongoose from 'mongoose';
import type { IJarToFE } from './jarMapper.js';
import type { IExpenseModel } from '../models/ExpenseSchema.js';

interface IResultExpenses extends IJarToFE {
  expenses: IExpenseModel[]
}

const getAllExpensesFromJar = async (jarId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId): Promise<IResultExpenses | undefined> => {
  try {
    const resultExpenses = await Jar.aggregate([
      { $match: { _id: jarId, users: userId } },
      {
        $lookup: {
          from: 'expenseperiods',
          localField: 'expensePeriods',
          foreignField: '_id',
          as: 'expensePeriods'
        }
      },
      { $unwind: '$expensePeriods' },
      { $unwind: '$expensePeriods.expenses' },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          color: { $first: '$color' },
          owner: { $first: '$owner' },
          users: { $first: '$users' },
          expenses: { $push: '$expensePeriods.expenses' }
        }
      },
      {
        $addFields: {
          expenses: {
            $sortArray: {
              input: '$expenses',
              sortBy: { date: -1 }
            }
          }
        }
      }
    ]).exec();
    return resultExpenses.length > 0 ? resultExpenses[0] : undefined;
  } catch (err) {
    return await Promise.reject(err);
  }
};

export default getAllExpensesFromJar;
