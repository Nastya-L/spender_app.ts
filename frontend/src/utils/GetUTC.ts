const GetUTC = (date: Date) => new Date(date.getTime() - ((date.getTimezoneOffset() * 60 * 1000)))
	.toISOString();

export default GetUTC;
