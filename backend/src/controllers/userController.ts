import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/UserSchema.js';
import errorFormatter from '../utils/errorFormatter.js';
import { createHashPassword } from '../utils/createHashPassword.js';
import { type IUserRequest } from '../middleware/getUserFromToken.js';
import { userMapper } from '../utils/userMapper.js';

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

export const updateUser = (req: IUserRequest, res: Response): void => {
  (async () => {
    const errors = validationResult(req).formatWith(errorFormatter);
    const userId = req.params.id;
    const { firstName, lastName, email } = req.body;
    const bearer = req.headers.authorization?.split(' ');

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      const userToken = bearer?.[1];
      if (!userToken) {
        return res.status(401).json({ error: [{ msg: 'Unauthorized user' }] });
      }

      const existingUser = await User.findById(userId);
      if (!existingUser) {
        return res.status(404).json({ error: [{ msg: 'User not found' }] });
      }

      if (email && email !== existingUser.email) {
        const emailTaken = await User.findOne({ email });
        if (emailTaken) {
          return res.status(400).json({ error: [{ msg: 'Email already in use' }] });
        }
      }
      existingUser.firstName = firstName || existingUser.firstName;
      existingUser.lastName = lastName || existingUser.lastName;
      existingUser.email = email || existingUser.email;

      await existingUser.save();

      const updatedUser = userMapper(existingUser, userToken);

      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json({ error: [{ msg: err }] });
    }
  })();
};

export const updatePassword = (req: IUserRequest, res: Response): void => {
  (async () => {
    const errors = validationResult(req).formatWith(errorFormatter);
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;
    const bearer = req.headers.authorization?.split(' ');

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      const userToken = bearer?.[1];
      if (!userToken) {
        return res.status(401).json({ error: [{ msg: 'Unauthorized user' }] });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: [{ msg: 'User not found' }] });
      }

      const isMatch = createHashPassword(currentPassword as string) === user.password;
      if (!isMatch) {
        return res.status(404).json({ error: [{ msg: 'Incorrect current password' }] });
      }

      user.password = createHashPassword(newPassword as string);

      await user.save();

      const updatedUser = userMapper(user, userToken);

      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json({ error: [{ msg: err }] });
    }
  })();
};

export const deleteUser = (req: IUserRequest, res: Response): void => {
  (async () => {
    const userId = req.params.id;

    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ error: [{ msg: 'User not found' }] });
      }

      res.status(200).json({ result: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: [{ msg: err }] });
    }
  })();
};
