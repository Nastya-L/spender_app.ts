import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import authClient, { IAuthClientError } from '../../services/authClient';
import { IExpense } from '../../interfaces/Expense';
import { ErrorResponse } from '../../types/Error';
import GetUTC from '../../utils/GetUTC';
import useErrorManager from '../../hooks/useErrorManager';
import ExpenseForm from '../ExpenseForm/ExpenseForm';
import { ActionSubmitButton } from '../UI/ActionButton/ActionButton';
import { CalendarDate } from '../../types/CalendarDate';

export interface INewExpenseNewProps {
	isAnimationEnd: boolean
	close: () => void
	AddNewExpense: (expense: IExpense) => void
}

const ExpenseFormNew: React.FC<INewExpenseNewProps> = ({
	isAnimationEnd, close, AddNewExpense
}) => {
	const navigate = useNavigate();
	const { id } = useParams();
	const [expenseDate, setExpenseDate] = useState<CalendarDate>(new Date());
	const [expenseValue, setExpenseValue] = useState('');
	const [expenseCategory, setExpenseCategory] = useState('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const {
		setErrors, clearErrors, getErrors
	} = useErrorManager();

	const CloseForm = () => {
		clearErrors();
		close();
		setExpenseCategory('');
	};

	const CreateExpense = () => {
		const newExpense = {
			value: expenseValue,
			category: expenseCategory,
			date: GetUTC(expenseDate as Date)
		};
		setIsLoading(true);
		authClient.post<IExpense>(`/jar/${id}/expense`, newExpense)
			.then((response) => {
				const responseData = response.data;
				setExpenseValue('');
				setExpenseCategory('');
				setExpenseDate(new Date());
				AddNewExpense(responseData);
				clearErrors();
				close();
			}).catch((error: IAuthClientError) => {
				if (error.redirect) {
					navigate(error.redirect);
					return;
				}
				if (axios.isAxiosError<ErrorResponse, Record<string, unknown>>(error)) {
					if (error.response.data) {
						const errorResponse = error.response.data;
						setErrors(errorResponse);
					} else {
						toast.error('Something went wrong');
					}
				}
			}).finally(() => {
				setIsLoading(false);
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
