import type { Response } from 'express';
import mongoose from 'mongoose';
import { type IUserRequest } from '../middleware/getUserFromToken.js';
import Jar from '../models/JarSchema.js';
import getTotalSumExpense from '../utils/getTotalSumExpense.js';

export const getStatistic = (req: IUserRequest, res: Response): void => {
  (async () => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: [{ msg: 'ID is not valid' }] });
      return;
    }

    const jarId = new mongoose.Types.ObjectId(req.params.id);
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: [{ msg: 'Unauthorized user' }] });
    }

    try {
      const foundJar = await Jar.findOne({ _id: jarId, users: user._id });
      if (!foundJar) {
        res.status(404).json({ error: [{ msg: 'No jar found' }] });
        return;
      }

      const result = await getTotalSumExpense(jarId, user._id) || {};

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: [{ msg: err }] });
    }
  })();
};
