import Jar from '../models/JarSchema.js';
import type mongoose from 'mongoose';
import type { IJarToFE } from './jarMapper.js';
import type { IExpenseModel } from '../models/ExpenseSchema.js';

export interface IJar extends IJarToFE {
  expenses: IExpenseModel[]
  totalExpenses: number
}

const getAllExpensesFromJar = async (
  limit: number | undefined, skip: number, jarId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId
): Promise<IJar | null> => {
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
        $lookup: {
          from: 'users',
          localField: 'expensePeriods.expenses.owner',
          foreignField: '_id',
          as: 'expensePeriods.expenses.owner'
        }
      },
      { $unwind: '$expensePeriods.expenses.owner' },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          color: { $first: '$color' },
          owner: { $first: '$owner' },
          users: { $first: '$users' },
          totalExpenses: { $sum: 1 },
          expenses: {
            $push: {
              _id: '$expensePeriods.expenses._id',
              value: '$expensePeriods.expenses.value',
              category: '$expensePeriods.expenses.category',
              date: '$expensePeriods.expenses.date',
              owner: {
                _id: '$expensePeriods.expenses.owner._id',
                firstName: '$expensePeriods.expenses.owner.firstName'
              }
            }
          }
        }
      },
      {
        $addFields: {
          expenses: {
            $sortArray: {
              input: '$expenses',
              sortBy: { date: -1, _id: -1 }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          color: 1,
          owner: 1,
          users: 1,
          totalExpenses: 1,
          expenses: limit ? { $slice: ['$expenses', skip, limit] } : '$expenses'
        }
      }
    ]).exec();
    return resultExpenses.length > 0 ? resultExpenses[0] : null;
  } catch (err) {
    return await Promise.reject(err);
  }
};

export default getAllExpensesFromJar;
