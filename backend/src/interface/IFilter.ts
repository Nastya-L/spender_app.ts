export interface IDateFilter {
  'expensePeriods.expenses.date': Record<string, Date>
};

export interface ICategoryFilter {
  'expensePeriods.expenses.category': { $in: string[] }
}

export type IExpenseFilter = Array<ICategoryFilter | IDateFilter>;
