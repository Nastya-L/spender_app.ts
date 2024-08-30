import React from 'react';
import { IExpense } from '../../interfaces/Expense';
import ImgForExpense from '../UI/ImgForExpense/ImgForExpense';

interface IExpenseProps {
	expense: IExpense;
}

const Expense: React.FC<IExpenseProps> = ({ expense }) => {
	const categoryImg = ImgForExpense.find((category) => category.name === expense.category);

	return (
		<div className="expense">
			<div className="expense__descr">
				<div className="expense__categories-icon">
					<img src={categoryImg.path} alt="categories-icon" />
				</div>
				<div className="expense__descr-wrap">
					<div className="expense__categories">
						{expense.category}
					</div>
					<div className="expense__owner">
						{expense.owner.firstName}
					</div>
				</div>
			</div>
			<div className="expense__value">{`${expense.value}₴`}</div>
		</div>
	);
};

export default Expense;
