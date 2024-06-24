import React from 'react';
import classNames from 'classnames';
import categoriesIcon from '../../images/icon/cheese.png';

const ExpenseRevers: React.FC = () => {
	console.log();

	return (
		<div className={classNames('expense', 'expense_revers')}>
			<div className={classNames('expense__descr', 'expense_revers')}>
				<div className="expense__categories-icon">
					<img src={categoriesIcon} alt="categories-icon" />
				</div>
				<div className={classNames('expense__descr-wrap', 'expense__descr-wrap_revers')}>
					<div className="expense__categories">
						Food
					</div>
					<div className="expense__owner">
						User
					</div>
				</div>
			</div>
			<div className="expense__value">2926.00 ₴</div>
		</div>
	);
};
export default ExpenseRevers;
