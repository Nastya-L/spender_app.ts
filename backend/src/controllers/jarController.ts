import mongoose from 'mongoose';
import type { Response } from 'express';
import Jar from '../models/JarSchema.js';
import type { IJar } from '../models/JarSchema.js';
import { validationResult } from 'express-validator';
import errorFormatter from '../utils/errorFormatter.js';
import jarMapper from '../utils/jarMapper.js';
import type { IUserRequest } from '../middleware/getUserFromToken.js';

export const getJar = (req: IUserRequest, res: Response): void => {
  (async () => {
    const userId = req.user?._id;

    await Jar.find({ users: userId })
      .then(async (existingJars) => {
        if (!existingJars) {
          return res.status(404).json({ error: [{ msg: 'No jar found' }] });
        }
        const jars = existingJars.map((jar) => jarMapper(jar));
        res.status(200).json(jars);
      }).catch((err) => {
        return res.status(500).json({ error: [{ msg: err }] });
      });
  })();
};

export const createJar = (req: IUserRequest, res: Response): void => {
  const errors = validationResult(req).formatWith(errorFormatter);

  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array() });
    return;
  }

  const jar: IJar = new Jar({
    name: req.body.name,
    color: req.body.color,
    users: req.user?._id,
    owner: req.user?._id
  });

  jar.save().then((newJar) => {
    const returnNewJar = jarMapper(newJar);
    return res.status(200).json(returnNewJar);
  }).catch((err) => {
    return res.status(500).json({ error: [{ msg: String(err) }] });
  });
};

/**
 *
 * @param req { name: 'JarName', color: 'red'}
 * @param res Update Object Jar
*/
export const updateJar = (req: IUserRequest, res: Response): void => {
  const jarId: string = req.params.id;
  const jarName: string = req.body.name;
  const jarColor: string = req.body.color;
  const userId = req.user?._id;

  const errors = validationResult(req).formatWith(errorFormatter);

  if (!mongoose.Types.ObjectId.isValid(jarId)) {
    res.status(400).json({ error: [{ msg: 'ID is not valid' }] });
    return;
  }

  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array() });
    return;
  }

  (async () => {
    await Jar.findOneAndUpdate(
      { _id: jarId, owner: userId },
      { $set: { name: jarName, color: jarColor } },
      { returnDocument: 'after' })
      .then((updatedJar) => {
        if (!updatedJar) {
          return res.status(404).json({ error: [{ msg: 'No jar found' }] });
        }
        const jar = jarMapper(updatedJar);
        return res.status(200).json(jar);
      })
      .catch((err) => {
        return res.status(500).json({ error: [{ msg: err }] });
      });
  })();
};

export const deleteJar = (req: IUserRequest, res: Response): void => {
  (async () => {
    const jarId: string = req.params.id;
    const userId = req.user?._id;

    await Jar.findOneAndDelete({ _id: jarId, owner: userId })
      .then(async (jar) => {
        if (!jar) {
          return res.status(404).json({ error: [{ msg: 'No jar found' }] });
        }
        return res.status(200).json({ result: 'You have successfully removed the jar' });
      })
      .catch((err) => {
        return res.status(500).json({ error: [{ msg: err }] });
      });
  })();
};
