import { IExpense, IExpenseDay } from '../../../interfaces/Expense';
import getSortDays from './getSortDays';

const addExpense = (
	entries: IExpenseDay[],
	expense: IExpense
) => {
	const resEntries = [...entries];
	const index = resEntries.findIndex((day) => String(day.date) === String(expense.date));
	if (index !== -1) {
		resEntries[index].expenses.unshift(expense);
		resEntries[index].totalSum += expense.value;
		return getSortDays(resEntries);
	}
	const newExpensesDay: IExpenseDay = {
		date: expense.date,
		totalSum: expense.value,
		expenses: [expense]
	};
	return getSortDays([...resEntries, newExpensesDay]);
};

export default addExpense;
