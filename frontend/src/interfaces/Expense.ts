export interface IExpense {
    _id: string;
    value: number;
    category: string;
    owner: {
        _id: string;
        firstName: string;
    }
    date: Date;
}

export interface IExpenseDay {
    date: Date;
    totalSum: number;
    expenses: IExpense[];
}

export interface UpdatedExpense {
	id: string;
	value: number;
	category: string;
	date: string;
}

export interface NewExpense {
	value: number;
	category: string;
	date: string;
}

export interface IPagination {
    page: number;
    limit: number | undefined;
    totalExpenses: number;
    totalPages: number;
}

export interface IJarExpensesArray {
    _id: string;
    name: string;
    color: string;
    users: [string];
    owner: string;
    days: [IExpenseDay];
}

export interface IGetJarWithPaginatedExpenses {
    jar: IJarExpensesArray;
    pagination: IPagination;
}
