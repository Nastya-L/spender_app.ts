const formatDate = (date: Date) => new Date(date).toLocaleString('en-US', {
	timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric'
});

export default formatDate;
