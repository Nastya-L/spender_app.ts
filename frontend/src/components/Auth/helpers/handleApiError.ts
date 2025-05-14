import axios from 'axios';
import { ErrorResponse } from '../../../types/Error';
import AuthFormMessageType from '../../../types/AuthFormMessageType';

const handleApiError = (
	error: unknown,
	setMessage: (text: string, type: AuthFormMessageType) => void
) => {
	if (axios.isAxiosError<ErrorResponse, Record<string, unknown>>(error)) {
		if (error.response) {
			const errorResponse = error.response.data.error;
			setMessage(errorResponse[0].msg, AuthFormMessageType.error);
		} else {
			setMessage('Something went wrong', AuthFormMessageType.error);
		}
	}
};

export default handleApiError;
