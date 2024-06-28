import React, { useState } from 'react';
import Calendar from 'react-calendar';

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
import Category from '../UI/Category/Category';

type CalendarDate = Date | [Date, Date];

interface INewExpenseProps {
	close: () => void
}

interface ICategoryType {
	name: string,
	path: string
}

const ExpenseForm: React.FC<INewExpenseProps> = ({ close }) => {
	const [date, setDate] = useState<CalendarDate>(new Date());

	const categories: ICategoryType[] = [
		{
			name: 'Car',
			path: car
		},
		{
			name: 'Travel',
			path: subway
		},
		{
			name: 'Cafes',
			path: utensils
		},
		{
			name: 'Shopping',
			path: clothes
		},
		{
			name: 'Self-care',
			path: barberShop
		},
		{
			name: 'Products',
			path: basket
		},
		{
			name: 'Health',
			path: health
		},
		{
			name: 'House',
			path: house
		},
		{
			name: 'Rest',
			path: music
		},
		{
			name: 'Payments',
			path: payment
		}
	];

	const CloseForm = () => {
		close();
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
				/>
			</div>
			<div className="expense-form__categories">
				{
					categories.map((category) => (
						<Category
							key={category.name}
							name={category.name}
							path={category.path}
						/>
					))
				}
			</div>
			<div className="expense-form__date">
				<Calendar
					locale="en"
					onChange={setDate}
					value={date}
				/>
			</div>
			<button className="expense-form__add">Add expense</button>
		</div>
	);
};

export default ExpenseForm;
