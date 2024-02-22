import type { Request, Response } from 'express';
import { type ErrorFormatter, type ValidationError, validationResult } from 'express-validator';
import User from '../models/UserSchema.js';
import { createHash } from 'crypto';

export const getUser = (req: Request, res: Response): void => {
  res.send('Not implemented');
};

const createToken = (): string => {
  const abc: string = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
  let token: string = '';
  for (let i = 0; i < 16; i++) {
    token += abc[Math.floor(Math.random() * (abc.length - 1))];
  }
  return token;
};

const errorFormatter: ErrorFormatter = (error: ValidationError) => {
  if (error.type === 'field') {
    return { msg: error.msg, field: error.path };
  }
  return { msg: error.msg };
};

export const registerUser = (req: Request, res: Response): void => {
  const errors = validationResult(req).formatWith(errorFormatter);
  const email: string = req.body.email;
  const password: string = createHash('sha256').update(req.body.password as string).digest('hex');

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const user = new User({
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    email: email,
    password: password,
    token: createToken()
  });

  User.findOne({ email: email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({ error: [{ msg: 'Account with the e-mail address already exists.', field: 'email' }] });
      }
      user.save().then((user) => {
        return res.status(200).json({ result: 'You have been successfully registered with us!' });
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
