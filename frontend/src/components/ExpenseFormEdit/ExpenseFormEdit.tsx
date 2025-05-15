import React, { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { IExpense, UpdatedExpense } from '../../interfaces/Expense';
import GetUTC from '../../utils/GetUTC';
import ExpenseForm from '../ExpenseForm/ExpenseForm';
import { ActionSubmitButton, ActionRemoveButton } from '../UI/ActionButton/ActionButton';
import { CalendarDate } from '../../types/CalendarDate';
import useErrorManager from '../../hooks/useErrorManager';
import { ErrorResponse } from '../../types/Error';

export interface IExpenseFormEditProps {
	isAnimationEnd: boolean
	expense: IExpense
	close: () => void
	UpdateExpense: (expense: UpdatedExpense) => Promise<void>
	DeleteExpense: (id: string) => Promise<void>
	isLoading: boolean

}

const ExpenseFormEdit: React.FC<IExpenseFormEditProps> = ({
	isAnimationEnd, expense, close, UpdateExpense,
	DeleteExpense, isLoading
}) => {
	const [expenseDate, setExpenseDate] = useState<CalendarDate>(expense.date);
	const [expenseValue, setExpenseValue] = useState<string>(String(expense.value));
	const [expenseCategory, setExpenseCategory] = useState(expense.category);

	const {
		setErrors, getErrors, clearErrors
	} = useErrorManager();

	useEffect(() => {
		setExpenseDate(expense.date);
		setExpenseValue(String(expense.value));
		setExpenseCategory(expense.category);
	}, [expense]);

	const CloseForm = () => {
		close();
		clearErrors();
		setExpenseValue('');
		setExpenseCategory('');
		setExpenseDate(new Date());
	};

	const ClickUpdateExpense = () => {
		const updateExpense = {
			id: expense._id,
			value: Number(expenseValue),
			category: expenseCategory,
			date: GetUTC(new Date(expenseDate as Date))
		};
		UpdateExpense(updateExpense)
			.then(() => {
				close();
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

	const ClickDeleteExpense = () => {
		DeleteExpense(expense._id)
			.then(() => {
				CloseForm();
			}).catch((err) => {
				const error = err as AxiosError<ErrorResponse, Record<string, unknown>>;
				if (!error.response.data) {
					toast.error('Something went wrong');
				}
			});
	};

	const footerForm = (
		<div className="expense-form__button">
			<ActionSubmitButton
				text="Update"
				isLoading={false}
				onClick={ClickUpdateExpense}
			/>
			<ActionRemoveButton
				text="Delete"
				isLoading={false}
				onClick={ClickDeleteExpense}
			/>
		</div>
	);

	return (
		<ExpenseForm
			name="edit expense"
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

export default ExpenseFormEdit;
