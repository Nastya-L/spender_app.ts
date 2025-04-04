import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { IExpense } from '../../../interfaces/Expense';
import { IAuthState } from '../../../interfaces/AuthState';
import Expense from '../../Expense/Expense';
import ExpenseRevers from '../../ExpenseRevers/ExpenseRevers';
import formatDate from '../helpers/formatDate';

interface ExpensesListProps {
	expenses: IExpense[];
	ClickToExpenseEdit: (idExp: string) => void;
}

const ExpensesList: React.FC<ExpensesListProps> = ({ expenses, ClickToExpenseEdit }) => {
	const userId = useSelector((state: IAuthState) => state.auth.user._id);
	const [selectedExpenseId, setSelectedExpenseId] = useState('');

	const ClickToExpense = (idExp: string) => {
		if (selectedExpenseId === idExp) {
			setSelectedExpenseId('');
		} else {
			setSelectedExpenseId(idExp);
		}
	};

	if (expenses.length === 0) {
		return <h3 className="history-day__not-found">No Expenses</h3>;
	}

	return (
		expenses.map((exp, i) => (
			<div key={exp._id} className="history-day">
				{((i === 0) || formatDate(exp.date) !== formatDate(expenses[i - 1].date))
					&& <h3 className="history-day__title">{formatDate(exp.date)}</h3>}
				{(exp.owner._id === userId)
					? (
						<Expense
							expense={exp}
							ClickToEdit={ClickToExpenseEdit}
							ClickToExpense={ClickToExpense}
							selected={selectedExpenseId === exp._id}
						/>
					)
					: <ExpenseRevers expense={exp} />}
			</div>
		))
	);
};

export default ExpensesList;
