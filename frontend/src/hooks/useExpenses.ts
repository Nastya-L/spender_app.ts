import { useCallback, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
	IExpense, IExpenseDay, IGetJarWithPaginatedExpenses, NewExpense, UpdatedExpense
} from '../interfaces/Expense';
import authClient from '../services/authClient';
import { ErrorResponse } from '../types/Error';
import removeExpenseById from '../components/HistoryJar/helpers/removeExpenseById';
import addExpense from '../components/HistoryJar/helpers/addExpense';
import findExpenseById from '../components/HistoryJar/helpers/findExpenseById';
import updateExpense from '../components/HistoryJar/helpers/updateExpense';

const useExpenses = () => {
	const { id } = useParams();
	const [expDays, setExpDays] = useState<Array<IExpenseDay>>([]);
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
			setExpDays((prev) => (requestPage === 1 ? jar.days : [...prev, ...jar.days]));
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
			setExpDays((prev) => addExpense(prev, responseData));
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
			setExpDays((prev) => {
				const updatingExpense = findExpenseById(prev, expense.id);
				if (String(updatingExpense.date) === String(responseData.date)) {
					return updateExpense(prev, responseData);
				}

				const updatedExpensesDay = removeExpenseById(prev, expense.id);

				return addExpense(updatedExpensesDay, responseData);
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
			setExpDays((prev) => removeExpenseById(prev, idExp));
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
		expDays,
		GetExpenses,
		AddExpense,
		DeleteExpense,
		UpdateExpense,
		isLoading,
		hasMore
	};
};

export default useExpenses;
