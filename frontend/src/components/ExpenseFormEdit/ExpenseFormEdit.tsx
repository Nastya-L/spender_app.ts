import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Calendar from 'react-calendar';
import { toast } from 'react-toastify';
import authClient, { IAuthClientError } from '../../services/authClient';
import { IExpense } from '../../interfaces/Expense';
import Category from '../UI/Category/Category';
import { ErrorResponse } from '../../types/Error';
import ErrorMessage from '../UI/ErrorMessage/ErrorMessage';
import GetUTC from '../../utils/GetUTC';
import { CategoryImgBig } from '../../utils/CategoryImg';
import useErrorManager from '../../hooks/useErrorManager';
import { SvgIconArrow, SvgIconTrash } from '../UI/SvgIcon/SvgIcon';

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

	const {
		setErrors, getErrors, clearErrors
	} = useErrorManager();

	const CloseForm = () => {
		clearErrors();
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

	const ClickDeleteExpense = () => {
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
			});
	};

	return (
		<div className="expense-form-edit">
			<h2 className="expense-form-edit__title">Edit Expense</h2>
			<button aria-label="arrow" onClick={CloseForm} className="expense-form__close">
				<SvgIconArrow />
			</button>
			<div className="expense-form-edit__value">
				<input
					ref={ref}
					required
					placeholder="Value"
					type="text"
					onChange={ChangeExpenseValue}
					value={expenseValue}
					className={
						getErrors('value')
							? 'expense-form-edit__input expense-form-edit__input_error'
							: 'expense-form-edit__input'
					}
				/>
				<ErrorMessage text={getErrors('value')} />
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
				<button onClick={ClickDeleteExpense} className="expense-form-edit__delete">
					<SvgIconTrash />
					Delete
				</button>
			</div>
		</div>
	);
};

export default ExpenseFormEdit;
