import React from 'react';
import addExpense from '../../images/icon/plus.png';
import addUsers from '../../images/icon/users.png';
import Expense from '../Expense/Expense';
import ExpenseRevers from '../ExpenseRevers/ExpenseRevers';

const HistoryJar: React.FC = () => {
	// TODO: Prevents it from becoming an inline function
	console.log();

	return (
		<div className="history-jar">
			<div className="history-jar__head">
				<h2 className="history-jar__name">Personal</h2>
				<button className="history-jar__head-icon">
					<img src={addExpense} alt="addExpense" />
				</button>
				<button className="history-jar__head-icon">
					<img src={addUsers} alt="addUsers" />
				</button>
			</div>
			<div className="history-jar__body">
				<div className="history-day">
					<h3 className="history-day__title">Today</h3>
					<Expense />
					<ExpenseRevers />
				</div>
				<div className="history-day">
					<h3 className="history-day__title">Today</h3>
					<Expense />
					<ExpenseRevers />
				</div>
				<div className="history-day">
					<h3 className="history-day__title">Today</h3>
					<Expense />
					<ExpenseRevers />
				</div>
			</div>
		</div>
	);
};

export default HistoryJar;
