import { IExpenseDay } from '../../../interfaces/Expense';

const removeExpenseById = (
	entries: IExpenseDay[],
	expenseId: string
): IExpenseDay[] => {
	const resEntries = [...entries];
	const day = resEntries.find((d) => d.expenses.some((exp) => exp._id === expenseId));

	day.expenses = day.expenses.filter((exp) => exp._id !== expenseId);
	day.totalSum = day.expenses.reduce((sum, exp) => sum + exp.value, 0);

	return resEntries.filter((d) => d.expenses.length > 0);
};

export default removeExpenseById;
