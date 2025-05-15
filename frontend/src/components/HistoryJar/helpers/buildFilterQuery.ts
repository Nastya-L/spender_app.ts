const buildFilterQuery = (filters: string[], startDate?: string, endDate?: string): string => {
	const query: string[] = [];

	if (filters.length) {
		query.push(`category=${filters.join(',')}`);
	}
	if (startDate) {
		query.push(`startDate=${encodeURIComponent(startDate)}`);
	}
	if (endDate) {
		query.push(`endDate=${encodeURIComponent(endDate)}`);
	}

	return query.join('&');
};

export default buildFilterQuery;
