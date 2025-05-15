import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { type ITokenPayload } from '../interface/ITokenPayload';

dotenv.config();

export const generateToken = (tokenPayload: ITokenPayload): string => {
  const secretKey = String(process.env.JWT_SECRET);
  const expires = Number(process.env.TOKEN_EXPIRES_IN_DAYS) || 5;
  const expiresIn: number = expires * 24 * 60 * 60 * 1000;

  return jwt.sign(tokenPayload, secretKey, { expiresIn });
};
