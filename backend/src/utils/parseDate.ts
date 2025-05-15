export const parseDate = (date: string, endOfDay: boolean = false): Date | undefined => {
  if (!date) return undefined;

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return undefined;
  }

  if (endOfDay) {
    parsedDate.setHours(23, 59, 59, 999);
  }

  return parsedDate;
};
