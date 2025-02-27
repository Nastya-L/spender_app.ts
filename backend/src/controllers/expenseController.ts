import type { Response } from 'express';
import mongoose from 'mongoose';
import Jar from '../models/JarSchema.js';
import { createExpensePeriod, updateExpensePeriod } from '../utils/expensePeriodMethods.js';
import { validationResult } from 'express-validator';
import errorFormatter from '../utils/errorFormatter.js';
import expenseWithUserMapper from '../utils/expenseMapper.js';
import type { IUserRequest } from '../middleware/getUserFromToken.js';
import getAllExpensesFromJar from '../utils/getAllExpensesFromJar.js';
import ExpensePeriod from '../models/ExpensePeriodSchema.js';
import jarWithPaginatedExpensesMapper from '../utils/jarWithPaginatedExpensesMapper.js';

export interface IExpense {
  value: string
  category: string
  owner: mongoose.Types.ObjectId
  date: Date
}

export const getExpense = (req: IUserRequest, res: Response): void => {
  (async () => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: [{ msg: 'ID is not valid' }] });
      return;
    }

    const userId = new mongoose.Types.ObjectId(req.user?._id);
    const jarId = new mongoose.Types.ObjectId(req.params.id);
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || undefined;
    const skip = limit ? (page - 1) * limit : 0;

    try {
      const foundJar = await Jar.findOne({ _id: jarId, users: userId });
      if (!foundJar) {
        res.status(404).json({ error: [{ msg: 'No jar found' }] });
        return;
      }

      const expenses = await getAllExpensesFromJar(limit, skip, jarId, userId);
      const totalExpenses = expenses?.totalExpenses ?? 0;
      const totalPages = limit ? Math.ceil((totalExpenses) / limit) : 1;

      const pagination = {
        page,
        limit,
        totalExpenses: totalExpenses,
        totalPages: totalPages
      };

      const DefaultResultExpenses = {
        jar: {
          _id: foundJar._id,
          name: foundJar.name,
          color: foundJar.color,
          owner: foundJar.owner,
          users: foundJar.users,
          expenses: []
        },
        pagination: {
          page,
          limit,
          totalExpenses: 0,
          totalPages: 0
        }
      };

      const resultExpensesWithPagination = expenses
        ? jarWithPaginatedExpensesMapper(expenses, pagination)
        : DefaultResultExpenses;

      res.status(200).json(resultExpensesWithPagination);
    } catch (err) {
      res.status(500).json({ error: [{ msg: err }] });
    }
  })();
};

export const createExpense = (req: IUserRequest, res: Response): void => {
  (async () => {
    const errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
      return;
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: [{ msg: 'Unauthorized user' }] });
    }

    const jarId: string = req.params.id;
    const expense: IExpense = {
      value: req.body.value,
      category: req.body.category,
      owner: user._id,
      date: req.body.date
    };

    try {
      const foundJar = await Jar.findOne({ _id: jarId, users: user._id });
      if (!foundJar) {
        res.status(404).json({ error: [{ msg: 'No jar found' }] });
        return;
      }
      let newExpense = await updateExpensePeriod(expense, jarId);
      if (!newExpense) {
        newExpense = await createExpensePeriod(expense, jarId);
      }
      const expenseResult = expenseWithUserMapper(newExpense, user);
      res.status(200).json(expenseResult);
    } catch (err) {
      res.status(500).json({ error: [{ msg: err }] });
    }
  })();
};

export const updateExpense = (req: IUserRequest, res: Response): void => {
  (async () => {
    if (!mongoose.Types.ObjectId.isValid(req.params.jarId) || !mongoose.Types.ObjectId.isValid(req.params.expenseId)) {
      res.status(400).json({ error: [{ msg: 'ID is not valid' }] });
      return;
    }

    const errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
      return;
    }

    const jarId: string = req.params.jarId;
    const expenseId: string = req.params.expenseId;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: [{ msg: 'Unauthorized user' }] });
    }

    const expenseValue = req.body.value;
    const expenseCategory = req.body.category;
    const expenseDate = req.body.date;

    try {
      const foundJar = await Jar.findOne({ _id: jarId, users: user._id });
      if (!foundJar) {
        res.status(404).json({ error: [{ msg: 'No jar found' }] });
        return;
      }

      const result = await ExpensePeriod.findOneAndUpdate(
        { jar: jarId, expenses: { $elemMatch: { _id: expenseId, owner: user._id } } },
        {
          $set: {
            'expenses.$.value': expenseValue,
            'expenses.$.category': expenseCategory,
            'expenses.$.date': expenseDate
          }
        },
        { new: true }
      );

      if (!result) {
        return res.status(503).json({ error: [{ msg: 'Try again later' }] });
      }

      const updatedExpense = result.expenses.find((exp) => {
        return String(exp._id) === expenseId;
      });
      if (!updatedExpense) {
        return res.status(503).json({ error: [{ msg: 'Try again later' }] });
      }

      const expenseResult = expenseWithUserMapper(updatedExpense, user);
      res.status(200).json(expenseResult);
    } catch (err) {
      res.status(500).json({ error: [{ msg: err }] });
    }
  })();
};

export const deleteExpense = (req: IUserRequest, res: Response): void => {
  (async () => {
    if (!mongoose.Types.ObjectId.isValid(req.params.jarId) || !mongoose.Types.ObjectId.isValid(req.params.expenseId)) {
      res.status(400).json({ error: [{ msg: 'ID is not valid' }] });
      return;
    }

    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: [{ msg: 'Unauthorized user' }] });
    }

    const jarId: string = req.params.jarId;
    const expenseId = new mongoose.Types.ObjectId(req.params.expenseId);

    try {
      const foundJar = await Jar.findOne({ _id: jarId, users: user._id });
      if (!foundJar) {
        res.status(404).json({ error: [{ msg: 'No jar found' }] });
        return;
      }

      const result = await ExpensePeriod.updateOne({ jar: jarId }, { $pull: { expenses: { _id: expenseId, owner: user._id } } }).exec();

      if (result.modifiedCount === 0) {
        return res.status(503).json({ error: [{ msg: 'Try again later' }] });
      }
      res.status(200).json({ result: 'Expenses delete successfully' });
    } catch (err) {
      res.status(500).json({ error: [{ msg: err }] });
    }
  })();
};
