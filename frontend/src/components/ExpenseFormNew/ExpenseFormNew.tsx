import React, { useState } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { NewExpense } from '../../interfaces/Expense';
import GetUTC from '../../utils/GetUTC';
import ExpenseForm from '../ExpenseForm/ExpenseForm';
import { ActionSubmitButton } from '../UI/ActionButton/ActionButton';
import { CalendarDate } from '../../types/CalendarDate';
import useErrorManager from '../../hooks/useErrorManager';
import { ErrorResponse } from '../../types/Error';

export interface INewExpenseNewProps {
	isAnimationEnd: boolean
	close: () => void
	AddExpense: (expense: NewExpense) => Promise<void>
	isLoading: boolean
}

const ExpenseFormNew: React.FC<INewExpenseNewProps> = ({
	isAnimationEnd, close, AddExpense, isLoading,
}) => {
	const [expenseDate, setExpenseDate] = useState<CalendarDate>(new Date());
	const [expenseValue, setExpenseValue] = useState('');
	const [expenseCategory, setExpenseCategory] = useState('');

	const {
		setErrors, clearErrors, getErrors
	} = useErrorManager();

	const CloseForm = () => {
		close();
		clearErrors();
		setExpenseValue('');
		setExpenseCategory('');
		setExpenseDate(new Date());
	};

	const CreateExpense = () => {
		const newExpense = {
			value: expenseValue,
			category: expenseCategory,
			date: GetUTC(expenseDate as Date)
		};
		AddExpense(newExpense)
			.then(() => {
				CloseForm();
			}).catch((err) => {
				const error = err as AxiosError<ErrorResponse, Record<string, unknown>>;
				if (error.response?.data) {
					const errorResponse = error.response.data;
					setErrors(errorResponse);
				} else {
					toast.error('Something went wrong');
				}
			});
	};

	const footerForm = (
		<ActionSubmitButton
			text="Add expense"
			isLoading={false}
			onClick={CreateExpense}
		/>
	);

	return (
		<ExpenseForm
			name="new expense"
			isAnimationEnd={isAnimationEnd}
			isLoading={isLoading}
			expenseValue={expenseValue}
			expenseCategory={expenseCategory}
			expenseDate={expenseDate}
			setExpenseDate={setExpenseDate}
			setExpenseValue={setExpenseValue}
			setExpenseCategory={setExpenseCategory}
			CloseForm={CloseForm}
			footerForm={footerForm}
			getErrors={getErrors}
		/>
	);
};

export default ExpenseFormNew;
