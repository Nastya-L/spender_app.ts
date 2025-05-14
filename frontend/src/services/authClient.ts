import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import store, { RootState } from '../store';
import { ErrorResponse } from '../types/Error';
import { logout } from '../reducers/AuthReducer';

const authClient = axios.create({
	baseURL: process.env.API_URL
});

interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
	headers: AxiosRequestHeaders
}

export interface IAuthClientError extends AxiosError {
	redirect?: string
}

authClient.interceptors.request.use(
	(config: AdaptAxiosRequestConfig) => {
		const state: RootState = store.getState();
		const { token } = state.auth.user;
		const retConfig = { ...config };
		if (token) {
			retConfig.headers.Authorization = `Bearer ${token}`;
		}
		return retConfig;
	}
);

authClient.interceptors.response.use(
	(res) => res,
	(error: IAuthClientError) => {
		const dispatch = useDispatch();
		if (axios.isAxiosError(error)) {
			if (error.response) {
				const errorResponse = error.response.data as ErrorResponse;
				const statusCode = error.response.status;
				/* eslint-disable no-param-reassign */
				switch (statusCode) {
				case 401:
					error.redirect = '/user/login';
					dispatch(logout());
					toast.error(`Unauthorized user: ${errorResponse.error[0].msg}`);
					break;
				case 403:
					error.redirect = '/user/login';
					dispatch(logout());
					toast.error(`Token has expired: ${errorResponse.error[0].msg}`);
					break;
				case 404:
					toast.error(`Not Found: ${errorResponse.error[0].msg}`);
					break;
				case 500:
					toast.error(`Internal Server Error: ${errorResponse.error[0].msg}`);
					break;
				case 503:
					toast.error(`Internal Server Error: ${errorResponse.error[0].msg}`);
					break;
				default:
					console.error('Error:', errorResponse.error[0].msg);
					break;
				}
			} else {
				toast.error(`Network Error: ${error.message}`);
			}
		}
		return Promise.reject(error);
	}
);

export default authClient;
