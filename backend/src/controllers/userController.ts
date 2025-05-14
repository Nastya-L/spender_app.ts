import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/UserSchema.js';
import errorFormatter from '../utils/errorFormatter.js';
import { createHashPassword } from '../utils/createHashPassword.js';

export const getUser = (req: Request, res: Response): void => {
  res.send('Not implemented');
};

export const registerUser = (req: Request, res: Response): void => {
  const errors = validationResult(req).formatWith(errorFormatter);
  const email: string = req.body.email;
  const password: string = createHashPassword(req.body.password as string);

  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array() });
    return;
  }

  const user = new User({
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    email: email,
    password: password,
    token: null
  });

  User.findOne({ email: email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({ error: [{ msg: 'Account with the e-mail address already exists.', field: 'email' }] });
      }
      user.save().then((user) => {
        return res.status(200).json({ result: 'You have been successfully registered!' });
      }).catch((err) => {
        return res.status(500).json({ error: [{ msg: String(err) }] });
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: [{ msg: err }] });
    });
};

export const updateUser = (req: Request, res: Response): void => {
  console.log('Request put');
};

export const deleteUser = (req: Request, res: Response): void => {
  console.log('Request delete');
};
