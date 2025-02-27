import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import authClient, { IAuthClientError } from '../../services/authClient';
import { IExpense } from '../../interfaces/Expense';
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
	UpdateExpense: (expense: IExpense) => void
	DeleteExpense: (id: string) => void
}

const ExpenseFormEdit: React.FC<IExpenseFormEditProps> = ({
	isAnimationEnd, expense, close, UpdateExpense, DeleteExpense
}) => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [expenseDate, setExpenseDate] = useState<CalendarDate>(expense.date);
	const [expenseValue, setExpenseValue] = useState(expense.value);
	const [expenseCategory, setExpenseCategory] = useState(expense.category);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const {
		setErrors, getErrors, clearErrors
	} = useErrorManager();

	useEffect(() => {
		setExpenseDate(expense.date);
		setExpenseValue(expense.value);
		setExpenseCategory(expense.category);
	}, [expense]);

	const CloseForm = () => {
		clearErrors();
		close();
	};

	const ClickUpdateExpense = () => {
		const updateExpense = {
			value: expenseValue,
			category: expenseCategory,
			date: GetUTC(new Date(expenseDate as Date))
		};
		setIsLoading(true);
		authClient.put<IExpense>(`/jar/${id}/expense/${expense._id}`, updateExpense)
			.then((response) => {
				const responseData = response.data;
				setExpenseValue('');
				setExpenseCategory('');
				setExpenseDate(new Date());
				UpdateExpense(responseData);
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

	const ClickDeleteExpense = () => {
		setIsLoading(true);
		authClient.delete(`/jar/${id}/expense/${expense._id}`)
			.then(() => {
				setExpenseValue('');
				setExpenseCategory('');
				setExpenseDate(new Date());
				DeleteExpense(expense._id);
				close();
				toast.success('The expense has been successfully deleted');
			}).catch((error: IAuthClientError) => {
				if (error.redirect) {
					navigate(error.redirect);
					return;
				}
				if (axios.isAxiosError<ErrorResponse, Record<string, unknown>>(error)) {
					if (!error.response) {
						toast.error('Something went wrong');
					}
				}
			}).finally(() => {
				setIsLoading(false);
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
