import { IExpenseDay } from '../../../interfaces/Expense';

const getSortDays = (
	expenses: IExpenseDay[]
) => expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export default getSortDays;
