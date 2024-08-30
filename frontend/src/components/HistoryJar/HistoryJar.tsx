import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import authClient, { IAuthClientError } from '../../services/authClient';
import { RootState } from '../../store';
import { openModal } from '../../reducers/ModalReducer';
import { IAuthState } from '../../interfaces/AuthState';
import Expense from '../Expense/Expense';
import ExpenseRevers from '../ExpenseRevers/ExpenseRevers';
import ExpenseForm from '../ExpenseForm/ExpenseForm';
import { ErrorResponse } from '../../types/Error';
import { IExpense, IExpensesArray } from '../../interfaces/Expense';

import addExpense from '../../images/icon/plus.png';
import addUsers from '../../images/icon/users.png';
import pencil from '../../images/icon/pencil.png';
import list from '../../images/icon/list.png';
import trash from '../../images/icon/trash.png';

const HistoryJar: React.FC = () => {
	const [newExpenseIsOpen, setNewExpenseIsOpen] = useState(false);
	const [jarOptionsIsOpen, setJarOptionsIsOpen] = useState(false);
	const [jarExpenses, setJarExpenses] = useState<Array<IExpense>>([]);
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const authState = useSelector((state: IAuthState) => state.auth.isAuthenticated);
	const userId = useSelector((state: IAuthState) => state.auth.user.id);
	const jars = useSelector((state: RootState) => state.jars.jars);

	const selectedJar = (jars.find((jar) => jar._id === id));
	const jarName = selectedJar ? selectedJar.name : 'Oops';

	useEffect(() => {
		if (!authState) {
			navigate('/');
			return;
		}

		if (!id) {
			navigate('/home');
			return;
		}
		authClient.get<IExpensesArray>(`/jar/${id}/expense`)
			.then((response) => {
				const { expenses } = response.data;
				setJarExpenses(expenses);
			}).catch((error: IAuthClientError) => {
				if (error.redirect) {
					navigate(error.redirect);
					return;
				}
				if (axios.isAxiosError<ErrorResponse, Record<string, unknown>>(error)) {
					if (!error.response) {
						console.log('Something went wrong');
					}
				}
			});
	}, [id]);

	const OpenNewExpense = () => {
		setNewExpenseIsOpen(true);
	};

	const CloseNewExpense = () => {
		setNewExpenseIsOpen(false);
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

	const formatDate = (date: Date) => new Date(date).toLocaleString('en-US', {
		timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric'
	});

	return (
		<div className="history-jar">
			<div className="history-jar__head">
				<h2 className="history-jar__name">{jarName}</h2>
				<button className="history-jar__head-item" onClick={OpenNewExpense}>
					<img src={addExpense} alt="addExpense" />
				</button>
				<div className={classNames('history-jar__head__menu', (jarOptionsIsOpen === true ? 'history-jar__head__menu_active' : ''))}>
					<button
						onClick={OpenJarOptions}
						className={classNames('history-jar__head-item_more', (jarOptionsIsOpen === true ? 'history-jar__head-item_active' : ''))}
					>
						<img src={list} alt="list" />
					</button>
					<div className={classNames((jarOptionsIsOpen === true ? 'history-jar__head__menu__open' : 'none'))}>
						<div className="history-jar__head__menu__items">
							<button className="history-jar__head-item">
								<img src={addUsers} alt="addUsers" />
							</button>
							<button onClick={EditJar} className="history-jar__head-item">
								<img src={pencil} alt="pencil" />
							</button>
							<button onClick={DeleteJar} className="history-jar__head-item">
								<img src={trash} alt="trash" />
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="history-jar__body">
				<div className={classNames((newExpenseIsOpen === true ? 'new-expense_open' : 'new-expense'))}>
					<ExpenseForm close={CloseNewExpense} />
				</div>
				{(!jarExpenses)
					? <h3 className="history-day__not-found">No Expenses</h3>
					: jarExpenses.map((exp, i) => (
						<div key={exp._id} className="history-day">
							{((i === 0) || formatDate(exp.date) !== formatDate(jarExpenses[i - 1].date))
							&& <h3 className="history-day__title">{ formatDate(exp.date) }</h3>}
							{(exp.owner._id === userId)
								? <Expense expense={exp} />
								: <ExpenseRevers expense={exp} />}
						</div>
					))}
			</div>
		</div>
	);
};

export default HistoryJar;
