import type mongoose from 'mongoose';
import Jar from '../models/JarSchema.js';

interface IStatistic {
  _id: mongoose.Types.ObjectId
  totalAmounts: [{
    userId: mongoose.Types.ObjectId
    firstName: string
    totalAmount: number
    categories?: [{
      category: string
      categoryAmount: number
    }]
  }]
}

const getTotalSumExpense = async (
  jarId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId): Promise<IStatistic | null> => {
  try {
    const statistic = await Jar.aggregate([
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
          _id: {
            jarId: '$_id',
            userId: '$expensePeriods.expenses.owner._id',
            firstName: '$expensePeriods.expenses.owner.firstName',
            category: '$expensePeriods.expenses.category'
          },
          expenses: { $push: '$expensePeriods.expenses' },
          totalAmount: { $sum: '$expensePeriods.expenses.value' },
          categoryAmount: { $sum: '$expensePeriods.expenses.value' }
        }
      },
      {
        $group: {
          _id: {
            jarId: '$_id.jarId',
            userId: '$_id.userId',
            firstName: '$_id.firstName'
          },
          totalAmount: { $sum: '$categoryAmount' },
          categories: {
            $push: {
              category: '$_id.category',
              categoryAmount: { $round: ['$categoryAmount', 2] }
            }
          }
        }
      },
      {
        $group: {
          _id: '$_id.jarId',
          totalAmounts: {
            $push: {
              userId: '$_id.userId',
              firstName: '$_id.firstName',
              totalAmount: { $round: ['$totalAmount', 2] },
              categories: {
                $cond: {
                  if: { $eq: ['$_id.userId', userId] },
                  then: '$categories',
                  else: '$$REMOVE'
                }
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          totalAmounts: 1
        }
      }
    ]).exec();

    return statistic.length > 0 ? statistic[0] : null;
  } catch (err) {
    return await Promise.reject(err);
  }
};

export default getTotalSumExpense;
