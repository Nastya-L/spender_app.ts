import React, {
	useEffect, useMemo, useRef, useState
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import InfiniteScroll from 'react-infinite-scroll-component';
import authClient, { IAuthClientError } from '../../services/authClient';
import { RootState } from '../../store';
import { IAuthState } from '../../interfaces/AuthState';
import Expense from '../Expense/Expense';
import ExpenseRevers from '../ExpenseRevers/ExpenseRevers';
import ExpenseFormNew from '../ExpenseFormNew/ExpenseFormNew';
import { ErrorResponse } from '../../types/Error';
import { IExpense, IGetJarWithPaginatedExpenses } from '../../interfaces/Expense';
import ExpenseFormEdit from '../ExpenseFormEdit/ExpenseFormEdit';
import AddExpenseButton from '../UI/AddExpenseButton/AddExpenseButton';
import useWidthWindow from '../../hooks/useWidthWindows';
import breakpoints from '../../constants/breakpoints';
import JarStatistics from '../JarStatistics/JarStatistics';
import HistoryJarPreloader from '../UI/HistoryJarPreloader/HistoryJarPreloader';
import Spinner from '../UI/Spinner/Spinner';
import HistoryJarHead from './HistoryJarHead/HistoryJarHead';
import { SvgIconAddSquare } from '../UI/SvgIcon/SvgIcon';
import getSortExpenses from './helpers/getSortExpenses';
import formatDate from './helpers/formatDate';
import useDialogueSection from '../../hooks/useDialogueSection';
import DialogueSectionWrapper from './DialogueSection/DialogueSection';

const HistoryJar: React.FC = () => {
	const [selectedExpenseId, setSelectedExpenseId] = useState('');
	const [jarExpenses, setJarExpenses] = useState<Array<IExpense>>([]);
	const [isPreloader, setIsPreloader] = useState<boolean>(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const { id } = useParams();
	const navigate = useNavigate();
	const authState = useSelector((state: IAuthState) => state.auth.isAuthenticated);
	const userId = useSelector((state: IAuthState) => state.auth.user.id);
	const jars = useSelector((state: RootState) => state.jars.jars);
	const refDialogueSection = useRef<HTMLDivElement>(null);

	const selectedJar = useMemo(() => jars.find((jar) => jar._id === id), [jars, id]);

	const { windowWidth } = useWidthWindow();
	const isMobile = windowWidth <= breakpoints.tablet;

	const limit: number = 10;
	const startPage: number = 1;

	const {
		CloseDialogueSection, OpenDialogueSection, isOpenDialogueSection, dialogueSection,
	} = useDialogueSection();

	const getJarExpenses = (requestPage: number) => {
		setIsPreloader(true);
		authClient.get<IGetJarWithPaginatedExpenses>(`/jar/${id}/expense?page=${requestPage}&limit=${limit}`)
			.then((response) => {
				const { jar } = response.data;
				const { page, totalPages } = response.data.pagination;
				setHasMore(page < totalPages);
				setJarExpenses((prev) => [...prev, ...jar.expenses]);
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
	};

	const nextPage = () => {
		setCurrentPage((prev) => prev + 1);
	};

	useEffect(() => {
		setJarExpenses([]);
		setCurrentPage(startPage);
	}, [id]);

	useEffect(() => {
		if (!authState) {
			navigate('/');
			return;
		}

		if (!id) {
			navigate('/home');
			return;
		}
		getJarExpenses(currentPage);
	}, [id, currentPage]);

	useEffect(() => {
		if (isOpenDialogueSection) {
			if (refDialogueSection.current && !isMobile) {
				refDialogueSection.current.scrollIntoView({ block: 'start', behavior: 'auto' });
			} else {
				window.scrollTo(0, 0);
			}
		}
	}, [isOpenDialogueSection]);

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
				close: CloseDialogueSection,
				AddNewExpense
			}
		});
	};

	const ClickToExpenseEdit = (idExp: string) => {
		OpenDialogueSection({
			component: ExpenseFormEdit,
			props: {
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

	return (
		<div className="history-jar__wrapper" ref={refDialogueSection}>
			{isPreloader && jarExpenses.length === 0
				? <HistoryJarPreloader />
				: (
					<div className="history-jar" id="scrollableDiv">
						{isMobile && (
							<div className="history-jar__mobile-add">
								<AddExpenseButton OpenNewExpense={OpenNewExpense} icon={<SvgIconAddSquare />} />
							</div>
						)}
						<InfiniteScroll
							dataLength={jarExpenses.length}
							next={nextPage}
							hasMore={hasMore}
							loader={(
								<div className="infinite-scroll">
									<Spinner />
								</div>
							)}
							scrollableTarget={!isMobile && 'scrollableDiv'}
							style={{ overflow: 'hidden' }}
						>
							<HistoryJarHead
								enableStatistics={jarExpenses.length !== 0}
								OpenNewExpense={OpenNewExpense}
								OpenStatistics={OpenStatistics}
								jar={selectedJar}
							/>
							<div className="history-jar__body">
								{selectedJar && (
									<DialogueSectionWrapper
										dialogueSection={dialogueSection}
										isOpenDialogueSection={isOpenDialogueSection}
										OpenDialogueSection={OpenDialogueSection}
									/>
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
						</InfiniteScroll>
					</div>
				)}
		</div>
	);
};

export default HistoryJar;
