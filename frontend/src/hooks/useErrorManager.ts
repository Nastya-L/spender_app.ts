import { useState } from 'react';
import { ErrorResponse } from '../types/Error';

interface ErrorsObjectType {
	[key: string]: string[]
}

const useErrorManager = () => {
	const [errorsObject, setErrorsObject] = useState<ErrorsObjectType>(null);

	const setErrors = (err: ErrorResponse) => {
		const newErrors = err.error.reduce<Record<string, string[]>>((item, { msg, field }) => {
			item[field] = item[field] || [];
			item[field].push(msg);
			return item;
		}, {});
		setErrorsObject(newErrors);
	};

	const getErrors = (field: string): string => {
		if (!errorsObject || !errorsObject[field]) {
			return '';
		}

		return errorsObject[field][0] || '';
	};

	const clearErrors = () => {
		setErrorsObject(null);
	};

	return {
		setErrors, getErrors, clearErrors
	};
};

export default useErrorManager;
