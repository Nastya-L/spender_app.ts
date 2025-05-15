import Jar from '../models/JarSchema.js';
import type mongoose from 'mongoose';
import type { IJarToFE } from './jarMapper.js';
import type { IExpenseModel } from '../models/ExpenseSchema.js';
import { type IExpenseFilter } from '../interface/IFilter.js';

export interface IJar extends IJarToFE {
  days: IExpenseModel[]
  totalExpenses: number
}

const getAllExpensesFromJar = async (
  limit: number | undefined, skip: number, jarId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId,
  expenseFilter: IExpenseFilter
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
      ...(expenseFilter.length > 0 ? [{ $match: { $and: expenseFilter } }] : []),
      {
        $group: {
          _id: {
            jarId: '$_id',
            date: { $dateToString: { format: '%Y-%m-%dT00:00:00.000Z', date: '$expensePeriods.expenses.date' } }
          },
          name: { $first: '$name' },
          color: { $first: '$color' },
          owner: { $first: '$owner' },
          users: { $first: '$users' },
          totalSum: { $sum: '$expensePeriods.expenses.value' },
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
        $group: {
          _id: '$_id.jarId',
          name: { $first: '$name' },
          color: { $first: '$color' },
          owner: { $first: '$owner' },
          users: { $first: '$users' },
          totalExpenses: { $sum: { $size: '$expenses' } },
          expenses: {
            $push: {
              date: '$_id.date',
              totalSum: '$totalSum',
              expenses: '$expenses'
            }
          }
        }
      },
      {
        $addFields: {
          expenses: {
            $sortArray: {
              input: {
                $map: {
                  input: '$expenses',
                  as: 'day',
                  in: {
                    $mergeObjects: [
                      '$$day',
                      {
                        expenses: {
                          $sortArray: {
                            input: '$$day.expenses',
                            sortBy: { date: -1, _id: -1 }
                          }
                        }
                      }
                    ]
                  }
                }
              },
              sortBy: { date: -1 }
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
          days: limit ? { $slice: ['$expenses', skip, limit] } : '$expenses'
        }
      }
    ]).exec();
    return resultExpenses.length > 0 ? resultExpenses[0] : null;
  } catch (err) {
    return await Promise.reject(err);
  }
};

export default getAllExpensesFromJar;
