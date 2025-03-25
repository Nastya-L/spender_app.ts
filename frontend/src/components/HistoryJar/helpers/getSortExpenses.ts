import { IExpense } from '../../../interfaces/Expense';

const getSortExpenses = (
	expenses: IExpense[]
) => expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export default getSortExpenses;
