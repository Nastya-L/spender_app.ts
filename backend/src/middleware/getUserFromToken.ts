import type { Request, Response, NextFunction } from 'express';
import User from '../models/UserSchema.js';
import { userMapper } from '../utils/userMapper.js';
import type { IUserToFE } from '../utils/userMapper.js';
import isTokenExpired from '../utils/isTokenExpired.js';

export interface IUserRequest extends Request {
  user?: IUserToFE
}

const getUserFromToken = (req: IUserRequest, res: Response, next: NextFunction): void => {
  (async () => {
    const bearer = req.headers.authorization?.split(' ');
    const userToken = bearer?.[1];
    const tokenExpiresInDays: number = Number(process.env.TOKEN_EXPIRES_IN_DAYS) || 1;

    if (!userToken) {
      return res.status(401).json({ error: [{ msg: 'Unauthorized user' }] });
    }
    await User.findOne({ 'token.token': userToken })
      .then(async (userFind) => {
        if (userFind) {
          const tokenExpired = isTokenExpired(userFind.token, tokenExpiresInDays);

          if (tokenExpired) {
            return res.status(401).json({ error: [{ msg: 'Token has expired' }] });
          }
          req.user = userMapper(userFind);
          next();
        } else {
          res.status(401).json({ error: [{ msg: 'Unauthorized user' }] });
        }
      }).catch((err) => {
        return res.status(500).json({ error: [{ msg: err }] });
      });
  })();
};

export default getUserFromToken;
