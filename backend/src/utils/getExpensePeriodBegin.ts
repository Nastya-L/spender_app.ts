const getExpensePeriodBegin = (date: Date): Date => {
  const year = new Date(date).getFullYear();
  const expenseMonth = new Date(date).getMonth();
  const periodCount: number = 3;

  const indexPeriod = Math.round((expenseMonth - 1) / periodCount);
  const startPeriod = (indexPeriod * periodCount);
  const dateBegin = new Date(year, startPeriod);

  return dateBegin;
};

export default getExpensePeriodBegin;
