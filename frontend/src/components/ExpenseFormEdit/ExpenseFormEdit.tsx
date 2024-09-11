import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Calendar from 'react-calendar';
import authClient, { IAuthClientError } from '../../services/authClient';
import { IExpense } from '../../interfaces/Expense';
import Category from '../UI/Category/Category';
import { ErrorResponse } from '../../types/Error';
import GetUTC from '../../utils/GetUTC';
import { CategoryImgBig } from '../../utils/CategoryImg';

import arrow from '../../images/icon/arrow-right.png';

type CalendarDate = Date | [Date, Date];

interface INewExpenseProps {
	expense: IExpense
	close: () => void
	UpdateExpense: (expense: IExpense) => void
	DeleteExpense: (id: string) => void
}

const ExpenseFormEdit: React.FC<INewExpenseProps> = ({
	expense, close, UpdateExpense, DeleteExpense
}) => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [expenseDate, setExpenseDate] = useState<CalendarDate>(expense.date);
	const [expenseValue, setExpenseValue] = useState(expense.value);
	const [expenseCategory, setExpenseCategory] = useState(expense.category);
	const ref = useRef<HTMLInputElement>(null);

	const CloseForm = () => {
		close();
	};

	useEffect(() => {
		if (ref.current) {
			ref.current.focus();
		}
	}, []);

	const ChangeExpenseValue = (e: React.FormEvent<HTMLInputElement>) => {
		setExpenseValue(e.currentTarget.value);
	};

	const ChangeExpenseCategory = (category: string) => {
		setExpenseCategory(category);
	};

	const ClickUpdateExpense = () => {
		const updateExpense = {
			value: expenseValue,
			category: expenseCategory,
			date: GetUTC(new Date(expenseDate as Date))
		};

		authClient.put<IExpense>(`/jar/${id}/expense/${expense._id}`, updateExpense)
			.then((response) => {
				const responseData = response.data;
				setExpenseValue('');
				setExpenseCategory('');
				setExpenseDate(new Date());
				UpdateExpense(responseData);
				close();
			}).catch((error: IAuthClientError) => {
				if (error.redirect) {
					navigate(error.redirect);
					return;
				}
				if (axios.isAxiosError<ErrorResponse, Record<string, unknown>>(error)) {
					if (!error.response) {
						console.log('Something went wrong');
					}
				}
			});
	};

	const ClickDeleteExpense = () => {
		authClient.delete(`/jar/${id}/expense/${expense._id}`)
			.then(() => {
				setExpenseValue('');
				setExpenseCategory('');
				setExpenseDate(new Date());
				DeleteExpense(expense._id);
				close();
			}).catch((error: IAuthClientError) => {
				if (error.redirect) {
					navigate(error.redirect);
					return;
				}
				if (axios.isAxiosError<ErrorResponse, Record<string, unknown>>(error)) {
					if (!error.response) {
						console.log('Something went wrong');
					}
				}
			});
	};

	return (
		<div className="expense-form-edit">
			<h2 className="expense-form-edit__title">Edit Expense</h2>
			<button onClick={CloseForm} className="expense-form__close">
				<img src={arrow} alt="arrow" />
			</button>
			<div className="expense-form-edit__value">
				<input
					ref={ref}
					required
					placeholder="Value"
					type="text"
					onChange={ChangeExpenseValue}
					value={expenseValue}
				/>
			</div>
			<div className="expense-form-edit__categories">
				{
					CategoryImgBig.map((category) => (
						<Category
							key={category.name}
							name={category.name}
							path={category.path}
							checked={(category.name === expense.category)}
							ChangeCategory={ChangeExpenseCategory}
						/>
					))
				}
			</div>
			<div className="expense-form-edit__date">
				<Calendar
					locale="en"
					onChange={setExpenseDate}
					value={expenseDate}
				/>
			</div>
			<div className="expense-form-edit__button">
				<button onClick={ClickUpdateExpense} className="expense-form-edit__update">Update</button>
				<button onClick={ClickDeleteExpense} className="expense-form-edit__delete">Delete</button>
			</div>
		</div>
	);
};

export default ExpenseFormEdit;
