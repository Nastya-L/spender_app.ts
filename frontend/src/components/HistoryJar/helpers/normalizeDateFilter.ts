import { CalendarDate } from '../../../types/CalendarDate';
import GetUTC from '../../../utils/GetUTC';

const normalizeDateFilter = (date: CalendarDate | null | undefined): [string, string] => {
	if (Array.isArray(date)) {
		return [GetUTC(date[0]), GetUTC(date[1])];
	}
	if (date) {
		const utc = GetUTC(date);
		return [utc, utc];
	}
	return ['', ''];
};

export default normalizeDateFilter;
