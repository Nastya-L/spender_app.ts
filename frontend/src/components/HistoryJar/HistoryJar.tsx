import React, { useState } from 'react';
import classNames from 'classnames';
import addExpense from '../../images/icon/plus.png';
import addUsers from '../../images/icon/users.png';
import Expense from '../Expense/Expense';
import ExpenseRevers from '../ExpenseRevers/ExpenseRevers';
import ExpenseForm from '../ExpenseForm/ExpenseForm';

const HistoryJar: React.FC = () => {
	const [newExpenseIsOpen, setNewExpenseIsOpen] = useState(false);

	const OpenNewExpense = () => {
		setNewExpenseIsOpen(true);
	};

	const CloseNewExpense = () => {
		setNewExpenseIsOpen(false);
	};

	return (
		<div className="history-jar">
			<div className="history-jar__head">
				<h2 className="history-jar__name">Personal</h2>
				<button className="history-jar__head-icon" onClick={OpenNewExpense}>
					<img src={addExpense} alt="addExpense" />
				</button>
				<button className="history-jar__head-icon">
					<img src={addUsers} alt="addUsers" />
				</button>
			</div>
			<div className="history-jar__body">
				<div className={classNames((newExpenseIsOpen === true ? 'new-expense_open' : 'new-expense'))}>
					<ExpenseForm close={CloseNewExpense} />
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
