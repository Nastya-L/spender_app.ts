import type { Request, Response } from 'express';
import User from '../models/UserSchema.js';
import { createHash } from 'crypto';
import createToken from '../utils/creatToken.js';
import { validationResult } from 'express-validator';
import errorFormatter from '../utils/errorFormatter.js';

/**
 *
 * @param req { login: 'mvmv@gmail.com', password: 'id8didjr84'}
 * @param res { id: skks, lastName: '', firstName: '', email: email, token: '', time: ''}
 */

const authorizationController = (req: Request, res: Response): void => {
  (async () => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
      return;
    }
    const email: string = req.body.email;
    const password: string = createHash('sha256').update(req.body.password as string).digest('hex');

    await User.findOne({ email: email, password: password })
      .then(async (existingUser) => {
        if (!existingUser) {
          return res.status(400).json({ error: [{ msg: 'Incorrect login or password' }] });
        }
        const token = createToken();
        await User.updateOne({ _id: existingUser.id }, { $set: { token: token } });

        const user = {
          id: existingUser.id,
          lastName: existingUser.lastName,
          firstName: existingUser.firstName,
          email: existingUser.email,
          token: token.token,
          time: existingUser.time
        };

        return res.status(200).json(user);
      })
      .catch((err) => {
        return res.status(500).json({ error: [{ msg: err }] });
      });
  })();
};

export default authorizationController;
