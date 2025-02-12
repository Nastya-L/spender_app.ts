export interface ITotalAmounts {
	userId: string;
	firstName: string;
	totalAmount: number;
	categories?: [{
		category: string;
		categoryAmount: number;
	}]
}

export interface IStatistics {
    _id: string;
    totalAmounts: [ITotalAmounts]
}
