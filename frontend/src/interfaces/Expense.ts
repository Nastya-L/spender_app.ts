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

export interface IExpensesArray {
    _id: string
    name: string
    color: string
    users: [string]
    owner: string
    expenses: [IExpense]
}
