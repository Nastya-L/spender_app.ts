import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Calendar from 'react-calendar';
import { toast } from 'react-toastify';
import authClient, { IAuthClientError } from '../../services/authClient';
import { IExpense } from '../../interfaces/Expense';
import Category from '../UI/Category/Category';
import { ErrorResponse } from '../../types/Error';
import GetUTC from '../../utils/GetUTC';
import { CategoryImgBig } from '../../utils/CategoryImg';
import ErrorMessage from '../UI/ErrorMessage/ErrorMessage';
import useErrorManager from '../../hooks/useErrorManager';
import { SvgIconArrow } from '../UI/SvgIcon/SvgIcon';

type CalendarDate = Date | [Date, Date];

interface INewExpenseProps {
	close: () => void
	AddNewExpense: (expense: IExpense) => void
}

const ExpenseForm: React.FC<INewExpenseProps> = ({ close, AddNewExpense }) => {
	const navigate = useNavigate();
	const { id } = useParams();
	const [expenseDate, setExpenseDate] = useState<CalendarDate>(new Date());
	const [expenseValue, setExpenseValue] = useState('');
	const [expenseCategory, setExpenseCategory] = useState('');

	const {
		setErrors, getErrors, clearErrors
	} = useErrorManager();

	const CloseForm = () => {
		clearErrors();
		close();
	};

	const ChangeExpenseValue = (e: React.FormEvent<HTMLInputElement>) => {
		setExpenseValue(e.currentTarget.value);
	};

	const ChangeExpenseCategory = (category: string) => {
		setExpenseCategory(category);
	};

	const CreateExpense = () => {
		const newExpense = {
			value: expenseValue,
			category: expenseCategory,
			date: GetUTC(expenseDate as Date)
		};

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
			});
	};

	return (
		<div className="expense-form">
			<h2 className="expense-form__title">New Expense</h2>
			<button aria-label="arrow" onClick={CloseForm} className="expense-form__close">
				<SvgIconArrow />
			</button>
			<div className="expense-form__value">
				<input
					required
					placeholder="Value"
					type="text"
					onChange={ChangeExpenseValue}
					value={expenseValue}
					className={
						getErrors('value')
							? 'expense-form__input expense-form__input_error'
							: 'expense-form__input'
					}
				/>
				<ErrorMessage text={getErrors('value')} />
			</div>
			<div className="expense-form__categories">
				{CategoryImgBig.map((category) => (
					<Category
						key={category.name}
						name={category.name}
						path={category.path}
						checked={false}
						ChangeCategory={ChangeExpenseCategory}
					/>
				))}
				<ErrorMessage text={getErrors('category')} />
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
