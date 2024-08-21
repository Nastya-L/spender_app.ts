import type { Response } from 'express';
import mongoose from 'mongoose';
import Jar from '../models/JarSchema.js';
import { createExpensePeriod, updateExpensePeriod } from '../utils/expensePeriodMethods.js';
import { validationResult } from 'express-validator';
import errorFormatter from '../utils/errorFormatter.js';
import expenseMapper from '../utils/expenseMapper.js';
import type { IUserRequest } from '../middleware/getUserFromToken.js';
import getAllExpensesFromJar from '../utils/getAllExpensesFromJar.js';

export interface IExpense {
  value: string
  category: string
  owner: string
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
    try {
      const foundJar = await Jar.findOne({ _id: jarId, users: userId });
      if (!foundJar) {
        res.status(404).json({ error: [{ msg: 'No jar found' }] });
        return;
      }

      const expenses = await getAllExpensesFromJar(jarId, userId);
      if (!expenses) {
        res.status(404).json({ error: [{ msg: 'No expenses found' }] });
        return;
      }
      res.status(200).json(expenses);
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

    const userId = req.user?._id;
    const jarId: string = req.params.id;
    const expense: IExpense = {
      value: req.body.value,
      category: req.body.category,
      owner: req.body.owner,
      date: req.body.date
    };

    try {
      const foundJar = await Jar.findOne({ _id: jarId, users: userId });
      if (!foundJar) {
        res.status(404).json({ error: [{ msg: 'No jar found' }] });
        return;
      }
      let newExpense = await updateExpensePeriod(expense, jarId);
      if (!newExpense) {
        newExpense = await createExpensePeriod(expense, jarId);
      }
      const expenseResult = expenseMapper(newExpense);
      res.status(200).json(expenseResult);
    } catch (err) {
      res.status(500).json({ error: [{ msg: err }] });
    }
  })();
};
