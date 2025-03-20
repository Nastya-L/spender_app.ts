import type mongoose from 'mongoose';
import type { IUser } from '../models/UserSchema.js';

export interface IUserToFE {
  _id: mongoose.Types.ObjectId
  lastName: string
  firstName: string
  token: string
  email: string
  time: Date
  role: number
}

export interface IAuthUser {
  _id: mongoose.Types.ObjectId
  lastName: string
  firstName: string
  email: string
  time: Date
  role: number
}

export const userMapper = (user: IUser, token: string): IUserToFE => {
  return {
    _id: user._id,
    lastName: user.lastName,
    firstName: user.firstName,
    token: token,
    email: user.email,
    time: user.time,
    role: user.role
  };
};

export const authUserMapper = (user: IUser): IAuthUser => {
  return {
    _id: user._id,
    lastName: user.lastName,
    firstName: user.firstName,
    email: user.email,
    time: user.time,
    role: user.role
  };
};
