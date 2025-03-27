import mongoose from 'mongoose';
import type { Document, Model } from 'mongoose';

const { Schema } = mongoose;

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  lastName: string
  firstName: string
  email: string
  password: string
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
