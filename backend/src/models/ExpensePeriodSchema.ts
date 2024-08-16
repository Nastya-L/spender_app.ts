import mongoose from 'mongoose';
import type { Document, Model } from 'mongoose';
import type { IExpenseModel } from './ExpenseSchema.js';
import ExpenseSchema from './ExpenseSchema.js';

const { Schema } = mongoose;

export interface IExpensePeriod extends Document {
  jar: mongoose.Types.ObjectId
  begin: Date
  expenses: IExpenseModel[]
}

const ExpensePeriodSchema = new Schema<IExpensePeriod>({
  jar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'jars'
  },
  begin: { type: Date },
  expenses: [ExpenseSchema]
});

const ExpensePeriod: Model<IExpensePeriod> = mongoose.model('ExpensePeriod', ExpensePeriodSchema);

export default ExpensePeriod;
