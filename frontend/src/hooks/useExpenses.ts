import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import getSortExpenses from '../components/HistoryJar/Utils/getSortExpenses';
import {
	IExpense, IGetJarWithPaginatedExpenses, NewExpense, UpdatedExpense
} from '../interfaces/Expense';
import authClient, { IAuthClientError } from '../services/authClient';
import { ErrorResponse } from '../types/Error';

const useExpenses = () => {
	const { id } = useParams();
	const [jarExpenses, setJarExpenses] = useState<Array<IExpense>>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<ErrorResponse | null>(null);
	const [hasMore, setHasMore] = useState(true);
	const limit: number = 10;

	useEffect(() => {
		setJarExpenses([]);
	}, [id]);

	const getExpenses = async (requestPage: number): Promise<void> => {
		setErrors(null);
		setIsLoading(true);
		const response = await authClient.get<IGetJarWithPaginatedExpenses>(`/jar/${id}/expense?page=${requestPage}&limit=${limit}`);
		try {
			const { jar } = response.data;
			const { page, totalPages } = response.data.pagination;
			setHasMore(page < totalPages);
			setJarExpenses((prev) => [...prev, ...jar.expenses]);
		} catch (error: unknown) {
			const err = error as IAuthClientError;
			if (axios.isAxiosError<ErrorResponse, Record<string, unknown>>(err)) {
				if (err.response.data) {
					const errorResponse = err.response.data;
					setErrors(errorResponse);
				} else {
					toast.error('Something went wrong');
				}
			}
		} finally {
			setIsLoading(false);
		}
	};

	const AddNewExpense = async (expense: NewExpense): Promise<void> => {
		setErrors(null);
		setIsLoading(true);
		const response = await authClient.post<IExpense>(`/jar/${id}/expense`, expense);
		try {
			const responseData = response.data;
			if (responseData) {
				setJarExpenses(getSortExpenses([responseData, ...jarExpenses]));
			} else {
				setJarExpenses([responseData]);
			}
		} catch (error: unknown) {
			const err = error as IAuthClientError;
			if (axios.isAxiosError<ErrorResponse, Record<string, unknown>>(err)) {
				if (err.response.data) {
					const errorResponse = err.response.data;
					setErrors(errorResponse);
				} else {
					toast.error('Something went wrong');
				}
			}
		} finally {
			setIsLoading(false);
		}
	};

	const UpdateExpense = async (expense: UpdatedExpense): Promise<void> => {
		setErrors(null);
		setIsLoading(true);
		const response = await authClient.put<IExpense>(`/jar/${id}/expense/${expense.id}`, expense);
		try {
			const responseData = response.data;
			const index = jarExpenses.findIndex((exp) => exp._id === expense.id);
			if (index !== -1) {
				const newExpensesJar = [...jarExpenses];
				newExpensesJar[index] = responseData;
				setJarExpenses(getSortExpenses(newExpensesJar));
			}
		} catch (error: unknown) {
			const err = error as IAuthClientError;
			if (axios.isAxiosError<ErrorResponse, Record<string, unknown>>(err)) {
				if (err.response.data) {
					const errorResponse = err.response.data;
					setErrors(errorResponse);
				} else {
					toast.error('Something went wrong');
				}
			}
		} finally {
			setIsLoading(false);
		}
	};

	const DeleteExpense = async (idExp: string): Promise<void> => {
		setErrors(null);
		setIsLoading(true);
		await authClient.delete(`/jar/${id}/expense/${idExp}`);
		try {
			const newExpensesJar = jarExpenses.filter((exp) => exp._id !== idExp);
			setJarExpenses(newExpensesJar);
			toast.success('The expense has been successfully deleted');
		} catch (error: unknown) {
			const err = error as IAuthClientError;
			if (axios.isAxiosError<ErrorResponse, Record<string, unknown>>(err)) {
				if (err.response.data) {
					const errorResponse = err.response.data;
					setErrors(errorResponse);
				} else {
					toast.error('Something went wrong');
				}
			}
		} finally {
			setIsLoading(false);
		}
	};

	return {
		jarExpenses,
		getExpenses,
		AddNewExpense,
		DeleteExpense,
		UpdateExpense,
		isLoading,
		errors,
		hasMore
	};
};

export default useExpenses;
