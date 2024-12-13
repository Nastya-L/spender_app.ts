import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import store, { RootState } from '../store';
import { ErrorResponse } from '../types/Error';

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
		if (axios.isAxiosError(error)) {
			if (error.response) {
				const errorRequest = error.response.data as ErrorResponse;
				const statusCode = error.response.status;
				/* eslint-disable no-param-reassign */
				switch (statusCode) {
				case 400:
					console.error('Bad Request:', errorRequest.error[0].msg);
					break;
				case 401:
					error.redirect = '/';
					console.error('Unauthorized user:', errorRequest.error[0].msg);
					break;
				case 403:
					error.redirect = '/';
					console.error('Token has expired:', errorRequest.error[0].msg);
					break;
				case 404:
					console.error('Not Found:', errorRequest.error[0].msg);
					break;
				case 500:
					console.error('Internal Server Error:', errorRequest.error[0].msg);
					break;
				default:
					console.error('Error:', errorRequest.error[0].msg);
					break;
				}
			} else {
				console.error('Network Error:', error.message);
			}
		}
		return Promise.reject(error);
	}
);

export default authClient;
