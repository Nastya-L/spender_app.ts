import React, {
	ComponentType, useEffect, useRef, useState
} from 'react';
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
import ExpenseFormNew, { INewExpenseNewProps } from '../ExpenseFormNew/ExpenseFormNew';
import { ErrorResponse } from '../../types/Error';
import { IExpense, IExpensesArray } from '../../interfaces/Expense';
import ExpenseFormEdit, { IExpenseFormEditProps } from '../ExpenseFormEdit/ExpenseFormEdit';
import {
	SvgIconAdd, SvgIconAddSquare, SvgIconDots, SvgIconInfo, SvgIconPen, SvgIconTrash, SvgIconUsers
} from '../UI/SvgIcon/SvgIcon';
import AddExpenseButton from '../UI/AddExpenseButton/AddExpenseButton';
import useWidthWindow from '../../hooks/useWidthWindows';
import breakpoints from '../../constants/breakpoints';
import JarStatistics, { JarStatisticsProps } from '../JarStatistics/JarStatistics';
import HistoryJarPreloader from '../UI/HistoryJarPreloader/HistoryJarPreloader';

type DialogueSectionPropsType = JarStatisticsProps | INewExpenseNewProps | IExpenseFormEditProps;

type DialogueSectionType<T> = {
	component: ComponentType<T> | null;
	props: T | null;
}

const HistoryJar: React.FC = () => {
	const [jarOptionsIsOpen, setJarOptionsIsOpen] = useState(false);
	const [selectedExpenseId, setSelectedExpenseId] = useState('');
	const [jarExpenses, setJarExpenses] = useState<Array<IExpense>>([]);
	const [isPreloader, setIsPreloader] = useState<boolean>(true);
	const [
		dialogueSection,
		setDialogueSection
	] = useState<DialogueSectionType<DialogueSectionPropsType>>({
		component: null,
		props: null
	});
	const [isOpenDialogueSection, setIsOpenDialogueSection] = useState<boolean>(false);
	const [isDialogueAnimationEnd, setIsDialogueAnimationEnd] = useState<boolean>(false);
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const authState = useSelector((state: IAuthState) => state.auth.isAuthenticated);
	const userId = useSelector((state: IAuthState) => state.auth.user.id);
	const jars = useSelector((state: RootState) => state.jars.jars);
	const refDialogueSection = useRef<HTMLDivElement>(null);

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
		if (isOpenDialogueSection) {
			if (refDialogueSection.current && !isMobile) {
				refDialogueSection.current.scrollIntoView({ block: 'start', behavior: 'auto' });
			} else {
				window.scrollTo(0, 0);
			}
		}
	}, [isOpenDialogueSection]);

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

	const OpenDialogueSection = (component: DialogueSectionType<DialogueSectionPropsType>) => {
		setDialogueSection(component);
		setIsOpenDialogueSection(true);
	};

	const CloseDialogueSection = () => {
		setIsOpenDialogueSection(false);
	};

	const OpenStatistics = () => {
		OpenDialogueSection({
			component: JarStatistics,
			props: {
				close: CloseDialogueSection
			}
		});
	};

	const OpenNewExpense = () => {
		OpenDialogueSection({
			component: ExpenseFormNew,
			props: {
				isAnimationEnd: isDialogueAnimationEnd,
				close: CloseDialogueSection,
				AddNewExpense
			}
		});
	};

	const ClickToExpenseEdit = (idExp: string) => {
		OpenDialogueSection({
			component: ExpenseFormEdit,
			props: {
				isAnimationEnd: isDialogueAnimationEnd,
				expense: jarExpenses.find((expense) => expense._id === idExp),
				close: CloseDialogueSection,
				UpdateExpense,
				DeleteExpense
			}
		});
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
		<div className="history-jar__wrapper" ref={refDialogueSection}>
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
										{selectedJar.owner === userId && (
											<>
												<button aria-label="pen" onClick={EditJar} className="history-jar__head-item">
													<SvgIconPen />
												</button>
												<button aria-label="trash" onClick={DeleteJar} className="history-jar__head-item">
													<SvgIconTrash />
												</button>
											</>
										)}
										{jarExpenses.length !== 0
											&& (
												<button
													aria-label="info"
													onClick={OpenStatistics}
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
							{selectedJar && (
								<div
									className={classNames(((
										isOpenDialogueSection) ? 'dialogue-section_open' : 'dialogue-section'))}
									onTransitionEnd={() => {
										if (!isOpenDialogueSection) {
											setDialogueSection(undefined);
											setIsDialogueAnimationEnd(false);
										} else {
											setIsDialogueAnimationEnd(true);
										}
									}}
								>
									{(dialogueSection && dialogueSection.props)
										&& (
											<dialogueSection.component
												// eslint-disable-next-line react/jsx-props-no-spreading
												{...dialogueSection.props}
												isAnimationEnd={isDialogueAnimationEnd}
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
