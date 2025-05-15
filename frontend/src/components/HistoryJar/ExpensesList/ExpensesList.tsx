import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { IExpenseDay } from '../../../interfaces/Expense';
import { IAuthState } from '../../../interfaces/AuthState';
import Expense from '../../Expense/Expense';
import ExpenseRevers from '../../ExpenseRevers/ExpenseRevers';
import formatDate from '../helpers/formatDate';

interface ExpensesListProps {
	expDays: IExpenseDay[];
	ClickToExpenseEdit: (idExp: string) => void;
}

const ExpensesList: React.FC<ExpensesListProps> = ({ expDays, ClickToExpenseEdit }) => {
	const userId = useSelector((state: IAuthState) => state.auth.user._id);
	const [selectedExpenseId, setSelectedExpenseId] = useState('');

	const ClickToExpense = (idExp: string) => {
		if (selectedExpenseId === idExp) {
			setSelectedExpenseId('');
		} else {
			setSelectedExpenseId(idExp);
		}
	};

	if (expDays.length === 0) {
		return <h3 className="history-day__not-found">No Expenses</h3>;
	}

	return (
		expDays.map((day) => (
			<div key={formatDate(day.date)} className="history-day">
				<div className="history-day__wrapper">
					<h3 className="history-day__title">{formatDate(day.date)}</h3>
					<p className="history-day__sum">
						{day.totalSum.toFixed(2)}
						<span className="history-day__sum_symbol">₴</span>
					</p>
				</div>

				{day.expenses.map((exp) => (
					(exp.owner._id === userId)
						? (
							<Expense
								key={exp._id}
								expense={exp}
								ClickToEdit={ClickToExpenseEdit}
								ClickToExpense={ClickToExpense}
								selected={selectedExpenseId === exp._id}
							/>
						)
						: <ExpenseRevers key={exp._id} expense={exp} />
				))}
			</div>
		))
	);
};

export default ExpensesList;
