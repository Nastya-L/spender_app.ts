import mongoose from 'mongoose';
import type { Document, Model } from 'mongoose';

const { Schema } = mongoose;

export interface IToken {
  token: string
  time: Date
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  lastName: string
  firstName: string
  email: string
  password: string
  token: IToken
  time: Date
  role: number
}

const UserSchema = new Schema<IUser>({
  lastName: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  token: {
    token: { type: String },
    time: { type: Date }
  },
  time: {
    type: Date,
    default: Date.now
  },
  role: {
    type: Number,
    default: 0
  }
});

const User: Model<IUser> = mongoose.model('User', UserSchema);

export default User;
