import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import Expense from '../Expense/Expense';
import ExpenseRevers from '../ExpenseRevers/ExpenseRevers';
import ExpenseForm from '../ExpenseForm/ExpenseForm';
import addExpense from '../../images/icon/plus.png';
import addUsers from '../../images/icon/users.png';
import pencil from '../../images/icon/pencil.png';
import list from '../../images/icon/list.png';
import trash from '../../images/icon/trash.png';
import { openModal } from '../../reducers/ModalReducer';

const HistoryJar: React.FC = () => {
	const [newExpenseIsOpen, setNewExpenseIsOpen] = useState(false);
	const [jarOptionsIsOpen, setJarOptionsIsOpen] = useState(false);
	const dispatch = useDispatch();

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

	return (
		<div className="history-jar">
			<div className="history-jar__head">
				<h2 className="history-jar__name">Personal</h2>
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
				<div className="history-day">
					<h3 className="history-day__title">Today</h3>
					<Expense />
					<ExpenseRevers />
				</div>
				<div className="history-day">
					<h3 className="history-day__title">Today</h3>
					<Expense />
					<ExpenseRevers />
				</div>
				<div className="history-day">
					<h3 className="history-day__title">Today</h3>
					<Expense />
					<ExpenseRevers />
				</div>
			</div>
		</div>
	);
};

export default HistoryJar;
