import React, {
	useEffect, useMemo, useRef, useState
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import authClient, { IAuthClientError } from '../../services/authClient';
import { RootState } from '../../store';
import { IAuthState } from '../../interfaces/AuthState';
import ExpenseFormNew from '../ExpenseFormNew/ExpenseFormNew';
import { ErrorResponse } from '../../types/Error';
import { IExpense, IGetJarWithPaginatedExpenses } from '../../interfaces/Expense';
import ExpenseFormEdit from '../ExpenseFormEdit/ExpenseFormEdit';
import AddExpenseButton from '../UI/AddExpenseButton/AddExpenseButton';
import useWidthWindow from '../../hooks/useWidthWindows';
import breakpoints from '../../constants/breakpoints';
import JarStatistics from '../JarStatistics/JarStatistics';
import HistoryJarPreloader from '../UI/HistoryJarPreloader/HistoryJarPreloader';
import HistoryJarHead from './HistoryJarHead/HistoryJarHead';
import { SvgIconAddSquare } from '../UI/SvgIcon/SvgIcon';
import getSortExpenses from './helpers/getSortExpenses';
import useDialogueSection from '../../hooks/useDialogueSection';
import DialogueSectionWrapper from './DialogueSection/DialogueSection';
import InfiniteScrollWrapper from './InfiniteScrollWrapper/InfiniteScrollWrapper';
import ExpensesList from './ExpensesList/ExpensesList';

const HistoryJar: React.FC = () => {
	const [jarExpenses, setJarExpenses] = useState<Array<IExpense>>([]);
	const [isPreloader, setIsPreloader] = useState<boolean>(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const { id } = useParams();
	const navigate = useNavigate();
	const authState = useSelector((state: IAuthState) => state.auth.isAuthenticated);
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
						<InfiniteScrollWrapper
							dataLength={jarExpenses.length}
							hasMore={hasMore}
							setCurrentPage={setCurrentPage}
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
								<ExpensesList expenses={jarExpenses} ClickToExpenseEdit={ClickToExpenseEdit} />
							</div>
						</InfiniteScrollWrapper>
					</div>
				)}
		</div>
	);
};

export default HistoryJar;
