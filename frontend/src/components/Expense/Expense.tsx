import React from 'react';
import categoriesIcon from '../../images/icon/cheese.png';

const Expense: React.FC = () => {
	console.log();

	return (
		<div className="expense">
			<div className="expense__descr">
				<div className="expense__categories-icon">
					<img src={categoriesIcon} alt="categories-icon" />
				</div>
				<div className="expense__descr-wrap">
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

export default Expense;
