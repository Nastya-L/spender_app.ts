import mongoose from 'mongoose';
import type { Response } from 'express';
import type { IUserRequest } from '../middleware/getUserFromToken.js';
import User from '../models/UserSchema.js';
import Jar from '../models/JarSchema.js';
import jarMapper from '../utils/jarMapper.js';
import ExpensePeriod from '../models/ExpensePeriodSchema.js';

export const shareJar = (req: IUserRequest, res: Response): void => {
  (async () => {
    const userEmail: string = req.body.email;
    const idJar: string = req.params.id;

    await User.findOne({ email: userEmail })
      .then(async (foundUser) => {
        if (!foundUser) {
          return res.status(400).json({ error: [{ field: 'email', msg: 'User with this email not found' }] });
        }

        const UserId = foundUser._id;
        const foundJar = await Jar.findOne({ _id: idJar });

        if (!foundJar) {
          return res.status(404).json({ error: [{ msg: 'No jar found' }] });
        }

        if (!foundJar.owner.equals(req.user?._id)) {
          return res.status(403).json({ error: [{ msg: 'You are not owner' }] });
        }

        if (foundJar.users.includes(UserId)) {
          return res.status(400).json({ error: [{ field: 'email', msg: 'The user is already in the jar' }] });
        }
        await Jar.findOneAndUpdate({ _id: idJar }, { $push: { users: UserId } }, { new: true })
          .populate({ path: 'users', select: { _id: 1, firstName: 1 } })
          .then(async (updateJar) => {
            if (!updateJar) {
              return res.status(503).json({ error: [{ msg: 'Try again later' }] });
            }
            const jar = jarMapper(updateJar);
            res.status(200).json(jar);
          });
      }).catch((err) => {
        return res.status(500).json({ error: [{ msg: err }] });
      });
  })();
};

export const deleteShareJar = (req: IUserRequest, res: Response): void => {
  (async () => {
    const idJar: string = req.params.idjar;
    const idUser = new mongoose.Types.ObjectId(req.params.iduser);

    await Jar.findOne({ _id: idJar })
      .then(async (foundJar) => {
        if (!foundJar) {
          return res.status(404).json({ error: [{ msg: 'No jar found' }] });
        }

        if (!foundJar.owner.equals(req.user?._id)) {
          return res.status(403).json({ error: [{ msg: 'You are not owner' }] });
        }

        if (!foundJar.users.includes(idUser)) {
          return res.status(400).json({ error: [{ field: 'email', msg: 'The user is not in the jar' }] });
        }
        await Jar.findOneAndUpdate({ _id: idJar }, { $pull: { users: idUser } }, { new: true })
          .populate({ path: 'users', select: { _id: 1, firstName: 1 } })
          .then(async (updateJar) => {
            if (!updateJar) {
              return res.status(503).json({ error: [{ msg: 'Try again later' }] });
            }
            const deletedUserExpenses = await ExpensePeriod.updateMany({ jar: idJar }, { $pull: { expenses: { owner: idUser } } }).exec();

            if (deletedUserExpenses.modifiedCount === 0) {
              return res.status(503).json({ error: [{ msg: 'Try again later' }] });
            }

            const jar = jarMapper(updateJar);
            res.status(200).json(jar);
          });
      }).catch((err) => {
        return res.status(500).json({ error: [{ msg: err }] });
      });
  })();
};
