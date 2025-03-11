export interface IExpense {
    _id: string
    value: string
    category: string
    owner: {
        _id: string,
        firstName: string
    }
    date: Date
}

export interface UpdatedExpense {
	id: string;
	value: string;
	category: string;
	date: string;
}

export interface NewExpense {
	value: string;
	category: string;
	date: string;
}

export interface IPagination {
    page: number
    limit: number | undefined
    totalExpenses: number
    totalPages: number
}

export interface IJarExpensesArray {
    _id: string
    name: string
    color: string
    users: [string]
    owner: string
    expenses: [IExpense]
}

export interface IGetJarWithPaginatedExpenses {
    jar: IJarExpensesArray
    pagination: IPagination
}
