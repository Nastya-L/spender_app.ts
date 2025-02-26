/* eslint-disable jsx-a11y/no-autofocus */
import React, {
	ReactElement, useEffect, useRef,
} from 'react';
import Calendar from 'react-calendar';
import { CategoryImgBig } from '../../utils/CategoryImg';
import Category from '../UI/Category/Category';
import ErrorMessage from '../UI/ErrorMessage/ErrorMessage';
import Spinner from '../UI/Spinner/Spinner';
import { SvgIconArrow } from '../UI/SvgIcon/SvgIcon';
import { CalendarDate } from '../../types/CalendarDate';

interface ExpenseFormProps {
	name: string;
	isAnimationEnd: boolean;
	isLoading: boolean;
	expenseValue: string;
	expenseCategory: string;
	expenseDate: CalendarDate;
	setExpenseDate: React.Dispatch<React.SetStateAction<CalendarDate>>;
	setExpenseValue: React.Dispatch<React.SetStateAction<string>>;
	setExpenseCategory: React.Dispatch<React.SetStateAction<string>>;
	CloseForm: () => void;
	footerForm: ReactElement;
	getErrors: (field: string) => string;

}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
	name, isAnimationEnd, isLoading, expenseValue, expenseCategory, expenseDate,
	setExpenseValue, setExpenseCategory,
	setExpenseDate, CloseForm, footerForm, getErrors
}) => {
	const ref = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (ref.current && isAnimationEnd) {
			ref.current.focus();
		}
	}, [isAnimationEnd, expenseValue]);

	const ChangeExpenseValue = (e: React.FormEvent<HTMLInputElement>) => {
		setExpenseValue(e.currentTarget.value);
	};

	const ChangeExpenseCategory = (category: string) => {
		setExpenseCategory(category);
	};

	return (
		<div className={isLoading
			? 'expense-form expense-form_background'
			: 'expense-form'}
		>
			{isLoading && (
				<div className="expense-form__loading">
					<Spinner />
				</div>
			)}
			<h2 className="expense-form__title">{name}</h2>
			<button
				aria-label="arrow"
				onClick={CloseForm}
				className="expense-form__close"
			>
				<SvgIconArrow />
			</button>
			<div className="expense-form__value">
				<input
					ref={ref}
					required
					placeholder="Value"
					type="number"
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
						checked={(category.name === expenseCategory)}
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
			{footerForm}
		</div>
	);
};

export default ExpenseForm;
