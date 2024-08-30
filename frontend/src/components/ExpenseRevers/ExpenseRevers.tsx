import React from 'react';
import classNames from 'classnames';
import { IExpense } from '../../interfaces/Expense';
import ImgForExpense from '../UI/ImgForExpense/ImgForExpense';

interface IExpenseReversProps {
	expense: IExpense;
}

const ExpenseRevers: React.FC<IExpenseReversProps> = ({ expense }) => {
	const categoryImg = ImgForExpense.find((category) => category.name === expense.category);

	return (
		<div className={classNames('expense', 'expense_revers')}>
			<div className={classNames('expense__descr', 'expense_revers')}>
				<div className="expense__categories-icon">
					<img src={categoryImg.path} alt={categoryImg.name} />
				</div>
				<div className={classNames('expense__descr-wrap', 'expense__descr-wrap_revers')}>
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
export default ExpenseRevers;
