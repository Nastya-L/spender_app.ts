import React, { ReactNode } from 'react';
import { IExpense } from '../../../interfaces/Expense';

interface HistoryDayProps {
	expense: IExpense;
	index: number;
	jarExpenses: IExpense[];
	children: ReactNode;
}

const HistoryDay: React.FC<HistoryDayProps> = ({
	expense, index, jarExpenses, children
}) => {
	const formatDate = (date: Date) => new Date(date).toLocaleString('en-US', {
		timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric'
	});
	return (
		<div key={expense._id} className="history-day">
			{((index === 0) || formatDate(expense.date) !== formatDate(jarExpenses[index - 1].date))
				&& <h3 className="history-day__title">{formatDate(expense.date)}</h3>}
			{children}
		</div>
	);
};

export default HistoryDay;
