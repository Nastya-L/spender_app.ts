import mongoose from 'mongoose';
import type { Response } from 'express';
import type { IUserRequest } from '../middleware/getUserFromToken.js';
import User from '../models/UserSchema.js';
import Jar from '../models/JarSchema.js';

export const shareJar = (req: IUserRequest, res: Response): void => {
  (async () => {
    const userEmail: string = req.body.email;
    const jarId: string = req.params.id;

    await User.findOne({ email: userEmail })
      .then(async (foundUser) => {
        if (!foundUser) {
          return res.status(400).json({ error: [{ msg: 'User with this email not found' }] });
        }

        const UserId = foundUser._id;

        await Jar.findOne({ _id: jarId })
          .then(async (foundJar) => {
            if (!foundJar) {
              return res.status(404).json({ error: [{ msg: 'No jar found' }] });
            }

            if (!foundJar.owner.equals(req.user?._id)) {
              return res.status(403).json({ error: [{ msg: 'You are not owner' }] });
            }

            if (foundJar.users.includes(UserId)) {
              return res.status(400).json({ error: [{ msg: 'The user is already in the jar' }] });
            } else {
              await Jar.updateOne({ _id: jarId }, { $push: { users: UserId } });
              res.status(200).json({ result: 'User added successfully' });
            }
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
          return res.status(400).json({ error: [{ msg: 'The user is not in the jar' }] });
        } else {
          await Jar.updateOne({ _id: idUser }, { $pull: { users: idUser } });
          res.status(200).json({ result: 'User delete successfully' });
        }
      }).catch((err) => {
        return res.status(500).json({ error: [{ msg: err }] });
      });
  })();
};
