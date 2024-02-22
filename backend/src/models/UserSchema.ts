import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  lastName: {
    type: String,
    required: [true]
  },
  firstName: {
    type: String,
    required: [true]
  },
  email: {
    type: String,
    required: [true]
  },
  password: {
    type: String,
    required: [true]
  },
  token: { type: String },
  time: {
    type: Date,
    default: Date.now
  },
  role: {
    type: Number,
    default: 0
  }
});

const User = mongoose.model('User', UserSchema);

export default User;
