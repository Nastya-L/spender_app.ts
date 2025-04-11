import { IExpense, IExpenseDay } from '../../../interfaces/Expense';

const findExpenseById = (
	days: IExpenseDay[],
	expenseId: string
): IExpense | undefined => {
	for (let i = 0; i < days.length; i += 1) {
		const expense = days[i].expenses.find((exp) => exp._id === expenseId);
		if (expense) {
			return expense;
		}
	}
	return undefined;
};

export default findExpenseById;
