import React, {
	useEffect, useMemo, useRef, useState
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from '../../store';
import { IAuthState } from '../../interfaces/AuthState';
import ExpenseFormNew from '../ExpenseFormNew/ExpenseFormNew';
import ExpenseFormEdit from '../ExpenseFormEdit/ExpenseFormEdit';
import AddExpenseButton from '../UI/AddExpenseButton/AddExpenseButton';
import useWidthWindow from '../../hooks/useWidthWindows';
import breakpoints from '../../constants/breakpoints';
import JarStatistics from '../JarStatistics/JarStatistics';
import HistoryJarPreloader from '../UI/HistoryJarPreloader/HistoryJarPreloader';
import HistoryJarHead from './HistoryJarHead/HistoryJarHead';
import { SvgIconAddSquare } from '../UI/SvgIcon/SvgIcon';
import DialogueSectionWrapper from './DialogueSection/DialogueSection';
import InfiniteScrollWrapper from './InfiniteScrollWrapper/InfiniteScrollWrapper';
import ExpensesList from './ExpensesList/ExpensesList';
import useDialogueSection from '../../hooks/useDialogueSection';
import useExpenses from '../../hooks/useExpenses';

const HistoryJar: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const { id } = useParams();
	const navigate = useNavigate();
	const authState = useSelector((state: IAuthState) => state.auth.isAuthenticated);
	const jars = useSelector((state: RootState) => state.jars.jars);
	const refDialogueSection = useRef<HTMLDivElement>(null);

	const selectedJar = useMemo(() => jars.find((jar) => jar._id === id), [jars, id]);

	const { windowWidth } = useWidthWindow();
	const isMobile = windowWidth <= breakpoints.tablet;

	const startPage: number = 1;

	const {
		CloseDialogueSection, OpenDialogueSection, isOpenDialogueSection, dialogueSection,
	} = useDialogueSection();

	const {
		expenses,
		GetExpenses,
		AddExpense,
		DeleteExpense,
		UpdateExpense,
		isLoading,
		hasMore
	} = useExpenses();

	useEffect(() => {
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
		GetExpenses(currentPage).catch(() => {
			toast.error('Something went wrong');
		});
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
				AddExpense,
			}
		});
	};

	const ClickToExpenseEdit = (idExp: string) => {
		OpenDialogueSection({
			component: ExpenseFormEdit,
			props: {
				expense: expenses.find((expense) => expense._id === idExp),
				close: CloseDialogueSection,
				UpdateExpense,
				DeleteExpense,
			}
		});
	};

	return (
		<div className="history-jar__wrapper" ref={refDialogueSection}>
			{isLoading && expenses.length === 0
				? <HistoryJarPreloader />
				: (
					<div className="history-jar" id="scrollableDiv">
						{isMobile && (
							<div className="history-jar__mobile-add">
								<AddExpenseButton OpenNewExpense={OpenNewExpense} icon={<SvgIconAddSquare />} />
							</div>
						)}
						<InfiniteScrollWrapper
							dataLength={expenses.length}
							hasMore={hasMore}
							setCurrentPage={setCurrentPage}
						>
							<HistoryJarHead
								enableStatistics={expenses.length !== 0}
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
										isLoading={isLoading}
									/>
								)}
								<ExpensesList expenses={expenses} ClickToExpenseEdit={ClickToExpenseEdit} />
							</div>
						</InfiniteScrollWrapper>
					</div>
				)}
		</div>
	);
};

export default HistoryJar;
