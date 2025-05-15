import type { Request, Response } from 'express';
import User from '../models/UserSchema.js';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import errorFormatter from '../utils/errorFormatter.js';
import { generateToken } from '../utils/generateToken.js';
import { type ITokenPayload } from '../interface/ITokenPayload.js';
import { userMapper } from '../utils/userMapper.js';
import { sendMail } from '../utils/sendMail.js';
import { resetPasswordTemplate } from '../templates/resetPasswordTemplate.js';
import { createHashPassword } from '../utils/createHashPassword.js';

dotenv.config();
const resetKey = String(process.env.JWT_SECRET_RESET);

/**
 *
 * @param req { login: 'mvmv@gmail.com', password: 'id8didjr84'}
 * @param res { id: skks, lastName: '', firstName: '', email: email, token: '', time: ''}
 */

export const authorizationController = (req: Request, res: Response): void => {
  (async () => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
      return;
    }
    const email: string = req.body.email;
    const password: string = createHashPassword(req.body.password as string);

    await User.findOne({ email: email, password: password })
      .then(async (existingUser) => {
        if (!existingUser) {
          return res.status(400).json({ error: [{ msg: 'Incorrect login or password' }] });
        }
        const tokenPayload: ITokenPayload = { id: existingUser.id };
        const token = generateToken(tokenPayload);

        const user = userMapper(existingUser, token);

        return res.status(200).json(user);
      })
      .catch((err) => {
        return res.status(500).json({ error: [{ msg: err }] });
      });
  })();
};

export const forgotPassword = (req: Request, res: Response): void => {
  (async () => {
    const email: string = req.body.email;
    const url = String(process.env.FRONTEND_URL);
    try {
      const user = await User.findOne({ email: email });

      if (!user) {
        return res.status(404).json({ error: [{ msg: 'User not found' }] });
      }

      const token = jwt.sign({ id: user.id }, resetKey, { expiresIn: '10m' });

      user.resetPasswordToken = token;
      await user.save();

      const resetURL = `${url}/user/reset-password?token=${token}`;

      const htmlContent = resetPasswordTemplate(resetURL);

      await sendMail(
        email,
        'Password Reset',
        htmlContent
      );

      res.status(200).json({ result: 'Reset link sent to email' });
    } catch (err) {
      res.status(500).json({ error: [{ msg: err }] });
    }
  })();
};

export const resetPassword = (req: Request, res: Response): void => {
  (async () => {
    const token: string = req.body.token;
    const newPassword: string = req.body.password;

    if (!token || !newPassword) {
      return res.status(400).json({ error: [{ msg: 'Token and new password are required' }] });
    }

    try {
      const decoded = jwt.verify(token, resetKey) as ITokenPayload;

      const user = await User.findOne({
        _id: decoded.id,
        resetPasswordToken: token
      });

      if (!user) {
        return res.status(401).json({ error: [{ msg: 'Invalid or expired token' }] });
      }

      user.password = createHashPassword(newPassword);

      user.resetPasswordToken = null;
      await user.save();

      res.status(200).json({ result: 'Password reset successfully' });
    } catch (err) {
      res.status(500).json({ error: [{ msg: err }] });
    }
  })();
};
