import mongoose from 'mongoose';
import type { Document, Model } from 'mongoose';

const { Schema } = mongoose;

export interface IJar extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  color: string
  created: Date
  users: [mongoose.Types.ObjectId]
  owner: mongoose.Types.ObjectId
  expensePeriods: [mongoose.Types.ObjectId]
}

const JarSchema = new Schema<IJar>({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expensePeriods: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExpensePeriod'
  }]
});

const Jar: Model<IJar> = mongoose.model('Jar', JarSchema);

export default Jar;
