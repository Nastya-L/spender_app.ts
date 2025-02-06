import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import authClient, { IAuthClientError } from '../../services/authClient';
import { RootState } from '../../store';
import { openModal } from '../../reducers/ModalReducer';
import { IAuthState } from '../../interfaces/AuthState';
import Expense from '../Expense/Expense';
import ExpenseRevers from '../ExpenseRevers/ExpenseRevers';
import ExpenseForm from '../ExpenseForm/ExpenseForm';
import { ErrorResponse } from '../../types/Error';
import { IExpense, IExpensesArray } from '../../interfaces/Expense';
import ExpenseFormEdit from '../ExpenseFormEdit/ExpenseFormEdit';
import {
	SvgIconAdd, SvgIconAddSquare, SvgIconDots, SvgIconInfo, SvgIconPen, SvgIconTrash, SvgIconUsers
} from '../UI/SvgIcon/SvgIcon';
import AddExpenseButton from '../UI/AddExpenseButton/AddExpenseButton';
import useWidthWindow from '../../hooks/useWidthWindows';
import breakpoints from '../../constants/breakpoints';
import JarStatistics from '../JarStatistics/JarStatistics';
import HistoryJarPreloader from '../UI/HistoryJarPreloader/HistoryJarPreloader';

const HistoryJar: React.FC = () => {
	const [newExpenseIsOpen, setNewExpenseIsOpen] = useState(false);
	const [jarOptionsIsOpen, setJarOptionsIsOpen] = useState(false);
	const [statisticsIsOpen, setStatisticsIsOpen] = useState(false);
	const [selectedExpenseId, setSelectedExpenseId] = useState('');
	const [editedExpenseId, setEditedExpenseId] = useState('');
	const [jarExpenses, setJarExpenses] = useState<Array<IExpense>>([]);
	const [isPreloader, setIsPreloader] = useState<boolean>(true);
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const authState = useSelector((state: IAuthState) => state.auth.isAuthenticated);
	const userId = useSelector((state: IAuthState) => state.auth.user.id);
	const jars = useSelector((state: RootState) => state.jars.jars);

	const selectedJar = (jars.find((jar) => jar._id === id));
	const jarName = selectedJar ? selectedJar.name : 'Oops';

	const { windowWidth } = useWidthWindow();
	const isMobile = windowWidth <= breakpoints.tablet;

	useEffect(() => {
		if (!authState) {
			navigate('/');
			return;
		}

		if (!id) {
			navigate('/home');
			return;
		}
		setIsPreloader(true);
		authClient.get<IExpensesArray>(`/jar/${id}/expense`)
			.then((response) => {
				const { expenses } = response.data;
				setJarExpenses(expenses || []);
			}).catch((error: IAuthClientError) => {
				if (error.redirect) {
					navigate(error.redirect);
					return;
				}
				if (axios.isAxiosError<ErrorResponse, Record<string, unknown>>(error)) {
					if (!error.response) {
						toast.error('Something went wrong');
					}
				}
			}).finally(() => {
				setIsPreloader(false);
			});
	}, [id]);

	useEffect(() => {
		if (newExpenseIsOpen) {
			window.scrollTo(0, 0);
		}
	}, [newExpenseIsOpen]);

	const OpenNewExpense = () => {
		setNewExpenseIsOpen(true);
		setStatisticsIsOpen(false);
	};

	const CloseStatistics = () => {
		setStatisticsIsOpen(false);
	};

	const CloseNewExpense = () => {
		setNewExpenseIsOpen(false);
		setEditedExpenseId('');
	};

	const OpenJarOptions = () => {
		if (jarOptionsIsOpen) {
			setJarOptionsIsOpen(false);
		} else {
			setJarOptionsIsOpen(true);
		}
	};

	const DeleteJar = () => {
		dispatch(openModal('deleteJar'));
	};

	const EditJar = () => {
		dispatch(openModal('editJar'));
	};

	const ShareJar = () => {
		dispatch(openModal('shareJar'));
	};

	const getSortExpenses = (
		expenses: IExpense[]
	) => expenses.sort((a, b) => new Date(b.date)
		.getTime() - new Date(a.date).getTime());

	const AddNewExpense = (expense: IExpense) => {
		if (jarExpenses) {
			setJarExpenses(getSortExpenses([expense, ...jarExpenses]));
		} else {
			setJarExpenses([expense]);
		}
	};

	const DeleteExpense = (idExp: string) => {
		const newExpensesJar = jarExpenses.filter((exp) => exp._id !== idExp);
		setJarExpenses(newExpensesJar);
	};

	const UpdateExpense = (expense: IExpense) => {
		const index = jarExpenses.findIndex((exp) => exp._id === expense._id);
		if (index !== -1) {
			const newExpensesJar = [...jarExpenses];
			newExpensesJar[index] = expense;
			setJarExpenses(getSortExpenses(newExpensesJar));
		}
	};

	const ClickToExpenseEdit = (idExp: string) => {
		setStatisticsIsOpen(false);
		setEditedExpenseId(idExp);
	};

	const ClickToExpense = (idExp: string) => {
		if (selectedExpenseId === idExp) {
			setSelectedExpenseId('');
		} else {
			setSelectedExpenseId(idExp);
		}
	};

	const formatDate = (date: Date) => new Date(date).toLocaleString('en-US', {
		timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric'
	});

	return (
		<div className="history-jar__wrapper">
			{isPreloader
				? <HistoryJarPreloader />
				: (
					<div className="history-jar">
						{isMobile && (
							<div className="history-jar__mobile-add">
								<AddExpenseButton OpenNewExpense={OpenNewExpense} icon={<SvgIconAddSquare />} />
							</div>
						)}
						<div className="history-jar__head">
							<h2 className="history-jar__name">{jarName}</h2>
							{!isMobile
								&& <AddExpenseButton OpenNewExpense={OpenNewExpense} icon={<SvgIconAdd />} />}
							<div className={classNames('history-jar__head__menu', (jarOptionsIsOpen && 'history-jar__head__menu_active'))}>
								<button
									onClick={OpenJarOptions}
									aria-label="list"
									className={classNames('history-jar__head-item_more', (jarOptionsIsOpen && 'history-jar__head-item_active'))}
								>
									<SvgIconDots />
								</button>
								<div className={classNames((jarOptionsIsOpen === true ? 'history-jar__head__menu__open' : 'none'))}>
									<div className="history-jar__head__menu__items">
										<button aria-label="addUsers" onClick={ShareJar} className="history-jar__head-item">
											<SvgIconUsers />
										</button>
										<button aria-label="pen" onClick={EditJar} className="history-jar__head-item">
											<SvgIconPen />
										</button>
										<button aria-label="trash" onClick={DeleteJar} className="history-jar__head-item">
											<SvgIconTrash />
										</button>
										{jarExpenses.length !== 0
										&& (
											<button
												aria-label="info"
												onClick={() => {
													setStatisticsIsOpen(true); setNewExpenseIsOpen(false);
												}}
												className="history-jar__head-item"
											>
												<SvgIconInfo />
											</button>
										)}
									</div>
								</div>
							</div>
						</div>
						<div className="history-jar__body">
							<div className={classNames(((newExpenseIsOpen || editedExpenseId) ? 'new-expense_open' : 'new-expense'))}>
								{(editedExpenseId)
									? (
										<ExpenseFormEdit
											expense={jarExpenses.find((expense) => expense._id === editedExpenseId)}
											close={CloseNewExpense}
											UpdateExpense={UpdateExpense}
											DeleteExpense={DeleteExpense}
										/>
									)
									: <ExpenseForm close={CloseNewExpense} AddNewExpense={AddNewExpense} />}
							</div>
							{selectedJar && (
								<div className={statisticsIsOpen ? 'statistics_open' : 'statistics'}>
									{statisticsIsOpen && (
										<JarStatistics
											close={CloseStatistics}
										/>
									)}
								</div>
							)}
							{(jarExpenses.length === 0)
								? <h3 className="history-day__not-found">No Expenses</h3>
								: jarExpenses.map((exp, i) => (
									<div key={exp._id} className="history-day">
										{((i === 0) || formatDate(exp.date) !== formatDate(jarExpenses[i - 1].date))
										&& <h3 className="history-day__title">{formatDate(exp.date)}</h3>}
										{(exp.owner._id === userId)
											? (
												<Expense
													expense={exp}
													ClickToEdit={ClickToExpenseEdit}
													ClickToExpense={ClickToExpense}
													selected={selectedExpenseId === exp._id}
												/>
											)
											: <ExpenseRevers expense={exp} />}
									</div>
								))}
						</div>
					</div>
				)}
		</div>
	);
};

export default HistoryJar;
