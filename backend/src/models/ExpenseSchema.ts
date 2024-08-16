import mongoose from 'mongoose';
import type { Document } from 'mongoose';

const { Schema } = mongoose;

export enum ExpenseCategory {
  CAR = 'car',
  TRAVEL = 'travel',
  CAFES = 'cafes',
  SHOPPING = 'shopping',
  SELFCARE = 'selfcare',
  PRODUCTS = 'products',
  HEALTH = 'health',
  HOUSE = 'house',
  REST = 'rest',
  PAYMENTS = 'payments'
}

export interface IExpenseModel extends Document {
  _id: mongoose.Types.ObjectId
  value: number
  category: string
  owner: mongoose.Types.ObjectId
  date: Date
}

const ExpenseSchema = new Schema<IExpenseModel>({
  value: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

export default ExpenseSchema;
