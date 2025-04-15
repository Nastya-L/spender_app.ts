import { useCallback, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import getSortExpenses from '../components/HistoryJar/helpers/getSortExpenses';
import {
	IExpense, IGetJarWithPaginatedExpenses, NewExpense, UpdatedExpense
} from '../interfaces/Expense';
import authClient from '../services/authClient';
import { ErrorResponse } from '../types/Error';

const useExpenses = () => {
	const { id } = useParams();
	const [expenses, setExpenses] = useState<Array<IExpense>>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const limit: number = 10;

	const GetExpenses = useCallback(async (requestPage: number, filter?: string): Promise<void> => {
		setIsLoading(true);
		try {
			const baseUrl = `/jar/${id}/expense?page=${requestPage}&limit=${limit}`;
			const fullUrl = filter ? `${baseUrl}&${filter}` : baseUrl;

			const response = await authClient.get<IGetJarWithPaginatedExpenses>(fullUrl);
			const { jar } = response.data;
			const { page, totalPages } = response.data.pagination;
			setHasMore(page < totalPages);
			setExpenses((prev) => (requestPage === 1 ? jar.expenses : [...prev, ...jar.expenses]));
		} catch (error) {
			if (axios.isAxiosError<ErrorResponse, Record<string, unknown>>(error)) {
				throw error;
			}
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	const AddExpense = useCallback(async (expense: NewExpense): Promise<void> => {
		setIsLoading(true);
		try {
			const response = await authClient.post<IExpense>(`/jar/${id}/expense`, expense);
			const responseData = response.data;
			setExpenses((prev) => getSortExpenses([...prev, responseData]));
		} catch (error) {
			if (axios.isAxiosError<ErrorResponse, Record<string, unknown>>(error)) {
				throw error;
			}
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	const UpdateExpense = useCallback(async (expense: UpdatedExpense): Promise<void> => {
		setIsLoading(true);
		try {
			const response = await authClient.put<IExpense>(`/jar/${id}/expense/${expense.id}`, expense);
			const responseData = response.data;
			setExpenses((prev) => {
				const index = prev.findIndex((exp) => exp._id === expense.id);
				if (index !== -1) {
					const newExpensesJar = [...prev];
					newExpensesJar[index] = responseData;
					return getSortExpenses(newExpensesJar);
				}
				return getSortExpenses(prev);
			});
		} catch (error) {
			if (axios.isAxiosError<ErrorResponse, Record<string, unknown>>(error)) {
				throw error;
			}
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	const DeleteExpense = useCallback(async (idExp: string): Promise<void> => {
		setIsLoading(true);
		try {
			await authClient.delete(`/jar/${id}/expense/${idExp}`);
			setExpenses((prev) => prev.filter((exp) => exp._id !== idExp));
			toast.success('The expense has been successfully deleted');
		} catch (error) {
			if (axios.isAxiosError<ErrorResponse, Record<string, unknown>>(error)) {
				throw error;
			}
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	return {
		expenses,
		GetExpenses,
		AddExpense,
		DeleteExpense,
		UpdateExpense,
		isLoading,
		hasMore
	};
};

export default useExpenses;
