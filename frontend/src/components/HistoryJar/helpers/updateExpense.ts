import { IExpense, IExpenseDay } from '../../../interfaces/Expense';
import getSortDays from './getSortDays';

const updateExpense = (
	entries: IExpenseDay[],
	expense: IExpense
) => {
	const resEntries = [...entries];
	const day = resEntries.find((d) => d.expenses
		.some((exp) => exp._id === expense._id));

	const index = day.expenses.findIndex((exp) => exp._id === expense._id);

	if (index !== -1) {
		day.totalSum += expense.value - day.expenses[index].value;
		day.expenses[index] = expense;
	}

	return getSortDays(resEntries);
};

export default updateExpense;
