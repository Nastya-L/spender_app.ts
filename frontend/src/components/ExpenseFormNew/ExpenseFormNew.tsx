import React, { useEffect, useState } from 'react';
import { NewExpense } from '../../interfaces/Expense';
import { ErrorResponse } from '../../types/Error';
import GetUTC from '../../utils/GetUTC';
import useErrorManager from '../../hooks/useErrorManager';
import ExpenseForm from '../ExpenseForm/ExpenseForm';
import { ActionSubmitButton } from '../UI/ActionButton/ActionButton';
import { CalendarDate } from '../../types/CalendarDate';

export interface INewExpenseNewProps {
	isAnimationEnd: boolean
	close: () => void
	AddNewExpense: (expense: NewExpense) => void
	errors: ErrorResponse
	isLoading: boolean
}

const ExpenseFormNew: React.FC<INewExpenseNewProps> = ({
	isAnimationEnd, close, AddNewExpense, errors, isLoading
}) => {
	const [expenseDate, setExpenseDate] = useState<CalendarDate>(new Date());
	const [expenseValue, setExpenseValue] = useState('');
	const [expenseCategory, setExpenseCategory] = useState('');
	const [localLoading, setLocalLoading] = useState(false);

	const {
		setErrors, clearErrors, getErrors
	} = useErrorManager();

	const CloseForm = () => {
		clearErrors();
		close();
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

	const CreateExpense = () => {
		setLocalLoading(true);
		const newExpense = {
			value: expenseValue,
			category: expenseCategory,
			date: GetUTC(expenseDate as Date)
		};
		AddNewExpense(newExpense);
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
