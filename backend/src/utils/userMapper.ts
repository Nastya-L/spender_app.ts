import type mongoose from 'mongoose';
import type { IToken, IUser } from '../models/UserSchema.js';

export interface IUserToFE {
  _id: mongoose.Types.ObjectId
  lastName: string
  firstName: string
  email: string
  token: IToken
  time: Date
  role: number
}

export const userMapper = (user: IUser): IUserToFE => {
  return {
    _id: user._id,
    lastName: user.lastName,
    firstName: user.firstName,
    email: user.email,
    token: user.token,
    time: user.time,
    role: user.role
  };
};
