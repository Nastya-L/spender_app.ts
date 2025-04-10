const GetUTC = (date: Date) => {
	const utcDate = new Date(Date.UTC(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
	));

	return utcDate.toISOString();
};

export default GetUTC;
