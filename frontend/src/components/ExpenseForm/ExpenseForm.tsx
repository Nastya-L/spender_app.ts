import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Calendar from 'react-calendar';
import authClient, { IAuthClientError } from '../../services/authClient';
import { IExpense } from '../../interfaces/Expense';
import Category from '../UI/Category/Category';
import { ErrorResponse } from '../../types/Error';

import car from '../../images/icon/car.png';
import subway from '../../images/icon/subway.png';
import utensils from '../../images/icon/utensils.png';
import clothes from '../../images/icon/clothes.png';
import barberShop from '../../images/icon/barber-shop.png';
import basket from '../../images/icon/basket.png';
import health from '../../images/icon/health.png';
import house from '../../images/icon/house.png';
import music from '../../images/icon/music.png';
import payment from '../../images/icon/payment.png';
import arrow from '../../images/icon/arrow-right.png';

type CalendarDate = Date | [Date, Date];

interface INewExpenseProps {
	close: () => void
	AddNewExpense: (expense: IExpense) => void
}

interface ICategoryType {
	name: string,
	path: string
}

const ExpenseForm: React.FC<INewExpenseProps> = ({ close, AddNewExpense }) => {
	const navigate = useNavigate();
	const { id } = useParams();
	const [expenseDate, setExpenseDate] = useState<CalendarDate>(new Date());
	const [expenseValue, setExpenseValue] = useState('');
	const [expenseCategory, setExpenseCategory] = useState('');

	const categories: ICategoryType[] = [
		{
			name: 'car',
			path: car
		},
		{
			name: 'travel',
			path: subway
		},
		{
			name: 'cafes',
			path: utensils
		},
		{
			name: 'shopping',
			path: clothes
		},
		{
			name: 'self-care',
			path: barberShop
		},
		{
			name: 'products',
			path: basket
		},
		{
			name: 'health',
			path: health
		},
		{
			name: 'house',
			path: house
		},
		{
			name: 'rest',
			path: music
		},
		{
			name: 'payments',
			path: payment
		}
	];

	const CloseForm = () => {
		close();
	};

	const ChangeExpenseValue = (e: React.FormEvent<HTMLInputElement>) => {
		setExpenseValue(e.currentTarget.value);
	};

	const getUTC = (date: Date) => new Date(date.getTime() - ((date.getTimezoneOffset() * 60 * 1000)))
		.toISOString();

	const ChangeExpenseCategory = (category: string) => {
		setExpenseCategory(category);
	};

	const CreateExpense = () => {
		const newExpense = {
			value: expenseValue,
			category: expenseCategory,
			date: getUTC(expenseDate as Date)
		};

		authClient.post<IExpense>(`/jar/${id}/expense`, newExpense)
			.then((response) => {
				const responseData = response.data;
				setExpenseValue('');
				setExpenseCategory('');
				setExpenseDate(new Date());
				AddNewExpense(responseData);
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
		<div className="expense-form">
			<h2 className="expense-form__title">New Expense</h2>
			<button onClick={CloseForm} className="expense-form__close">
				<img src={arrow} alt="arrow" />
			</button>
			<div className="expense-form__value">
				<input
					required
					placeholder="Value"
					type="text"
					onChange={ChangeExpenseValue}
					value={expenseValue}
				/>
			</div>
			<div className="expense-form__categories">
				{
					categories.map((category) => (
						<Category
							key={category.name}
							name={category.name}
							path={category.path}
							ChangeCategory={ChangeExpenseCategory}
						/>
					))
				}
			</div>
			<div className="expense-form__date">
				<Calendar
					locale="en"
					onChange={setExpenseDate}
					value={expenseDate}
				/>
			</div>
			<button onClick={CreateExpense} className="expense-form__add">Add expense</button>
		</div>
	);
};

export default ExpenseForm;
