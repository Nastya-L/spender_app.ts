import { type IExpenseFilter } from '../interface/IFilter';

export const buildMatchFilters = (
  categories: string[],
  startDate: Date | undefined,
  endDate: Date | undefined
): IExpenseFilter => {
  const matchFilters: IExpenseFilter = [];

  if (categories && categories.length > 0) {
    matchFilters.push({ 'expensePeriods.expenses.category': { $in: categories } });
  }

  if (startDate || endDate) {
    const dateFilter: Record<string, Date> = {};

    if (startDate) {
      dateFilter.$gte = startDate;
    }

    if (endDate) {
      dateFilter.$lte = endDate;
    }

    matchFilters.push({ 'expensePeriods.expenses.date': dateFilter });
  }

  return matchFilters;
};
