import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authUserMapper, type IAuthUser } from '../utils/userMapper.js';
import User from '../models/UserSchema.js';
import { type ITokenPayload } from '../interface/ITokenPayload.js';
import * as dotenv from 'dotenv';

dotenv.config();

export interface IUserRequest extends Request {
  user?: IAuthUser
}

const getUserFromToken = (req: IUserRequest, res: Response, next: NextFunction): void => {
  (async () => {
    const secretKey = String(process.env.JWT_SECRET);
    const bearer = req.headers.authorization?.split(' ');

    try {
      const userToken = bearer?.[1];

      if (!userToken) {
        return res.status(401).json({ error: [{ msg: 'Unauthorized user' }] });
      }

      const decoded = jwt.verify(userToken, secretKey) as ITokenPayload;

      if (!decoded?.id) {
        return res.status(401).json({ error: [{ msg: 'Invalid token: No user ID' }] });
      }
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ error: [{ msg: 'User not found' }] });
      }

      req.user = authUserMapper(user);
      next();
    } catch (error) {
      return res.status(403).json({ error: [{ msg: 'Invalid or expired token' }] });
    }
  })();
};

export default getUserFromToken;
