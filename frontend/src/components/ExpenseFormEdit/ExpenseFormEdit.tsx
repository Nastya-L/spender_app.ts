import React, { useEffect, useState } from 'react';
import { IExpense, UpdatedExpense } from '../../interfaces/Expense';
import { ErrorResponse } from '../../types/Error';
import GetUTC from '../../utils/GetUTC';
import useErrorManager from '../../hooks/useErrorManager';
import ExpenseForm from '../ExpenseForm/ExpenseForm';
import { ActionSubmitButton, ActionRemoveButton } from '../UI/ActionButton/ActionButton';
import { CalendarDate } from '../../types/CalendarDate';

export interface IExpenseFormEditProps {
	isAnimationEnd: boolean
	expense: IExpense
	close: () => void
	UpdateExpense: (expense: UpdatedExpense) => void
	DeleteExpense: (id: string) => void
	errors: ErrorResponse
	isLoading: boolean
}

const ExpenseFormEdit: React.FC<IExpenseFormEditProps> = ({
	isAnimationEnd, expense, close, UpdateExpense, DeleteExpense, errors, isLoading
}) => {
	const [localLoading, setLocalLoading] = useState(false);
	const [expenseDate, setExpenseDate] = useState<CalendarDate>(expense.date);
	const [expenseValue, setExpenseValue] = useState(expense.value);
	const [expenseCategory, setExpenseCategory] = useState(expense.category);

	const {
		setErrors, clearErrors, getErrors
	} = useErrorManager();

	useEffect(() => {
		setExpenseDate(expense.date);
		setExpenseValue(expense.value);
		setExpenseCategory(expense.category);
	}, [expense]);

	const CloseForm = () => {
		close();
		clearErrors();
		setExpenseCategory('');
	};

	useEffect(() => {
		if (errors) {
			setErrors(errors);
		}
		if (!isLoading && localLoading && !errors) {
			close();
			clearErrors();
			setExpenseValue('');
			setExpenseCategory('');
			setExpenseDate(new Date());
		}
		setLocalLoading(isLoading);
	}, [isLoading, errors]);

	const ClickUpdateExpense = () => {
		setLocalLoading(true);
		const updateExpense = {
			id: expense._id,
			value: expenseValue,
			category: expenseCategory,
			date: GetUTC(new Date(expenseDate as Date))
		};
		UpdateExpense(updateExpense);
	};

	const ClickDeleteExpense = () => {
		setLocalLoading(true);
		DeleteExpense(expense._id);
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
