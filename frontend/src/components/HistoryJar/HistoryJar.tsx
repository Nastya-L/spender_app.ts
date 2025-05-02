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
import Filters from '../Filters/Filters';
import buildFilterQuery from './helpers/buildFilterQuery';
import { CalendarDate } from '../../types/CalendarDate';
import normalizeDateFilter from './helpers/normalizeDateFilter';
import findExpenseById from './helpers/findExpenseById';

const HistoryJar: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [filterCategory, setFilterCategory] = useState<Array<string>>([]);
	const [filterDate, setFilterDate] = useState<CalendarDate>();
	const { id } = useParams();
	const navigate = useNavigate();
	const authState = useSelector((state: IAuthState) => state.auth.isAuthenticated);
	const jars = useSelector((state: RootState) => state.jars.jars);
	const refDialogueSection = useRef<HTMLDivElement>(null);

	const selectedJar = useMemo(() => jars.find((jar) => jar._id === id), [jars, id]);

	const { windowWidth } = useWidthWindow();
	const isMobile = windowWidth <= breakpoints.tablet;

	const startPage: number = 1;
	const isFilterActive = filterCategory.length > 0 || !!filterDate;

	const {
		CloseDialogueSection, OpenDialogueSection, isOpenDialogueSection, dialogueSection,
	} = useDialogueSection();

	const {
		expDays,
		GetExpenses,
		AddExpense,
		DeleteExpense,
		UpdateExpense,
		isLoading,
		hasMore
	} = useExpenses();

	const onClearFilters = () => {
		CloseDialogueSection();
		setFilterCategory([]);
		setFilterDate(undefined);
		setCurrentPage(startPage);
	};

	useEffect(() => {
		onClearFilters();
		setCurrentPage(startPage);
	}, [id]);

	const getFilters = (selectedFilterCategory: string[], selectedDate: CalendarDate) => {
		setCurrentPage(startPage);
		setFilterCategory(selectedFilterCategory);
		setFilterDate(selectedDate);
	};

	useEffect(() => {
		if (!authState) {
			navigate('/');
			return;
		}

		if (!id) {
			navigate('/home');
			return;
		}

		const [startDate, endDate] = normalizeDateFilter(filterDate);

		const stringRequest = filterCategory ? buildFilterQuery(filterCategory, startDate, endDate) : '';
		GetExpenses(currentPage, stringRequest)
			.then(() => {
				if (dialogueSection && dialogueSection.component) {
					if (dialogueSection.component.name === Filters.name) {
						CloseDialogueSection();
					}
				}
			})
			.catch(() => toast.error('Something went wrong'));
	}, [currentPage, filterCategory, filterDate]);

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
				expense: findExpenseById(expDays, idExp),
				close: CloseDialogueSection,
				UpdateExpense,
				DeleteExpense,
			}
		});
	};

	const openFilter = () => {
		OpenDialogueSection({
			component: Filters,
			props: {
				close: CloseDialogueSection,
				getFilters,
				onClearFilters,
				filterCategory,
				filterDate
			}
		});
	};

	return (
		<div className="history-jar__wrapper" ref={refDialogueSection}>
			{isLoading && expDays.length === 0
				? <HistoryJarPreloader />
				: (
					<div className="history-jar" id="scrollableDiv">
						{isMobile && (
							<div className="history-jar__mobile-add">
								<AddExpenseButton OpenNewExpense={OpenNewExpense} icon={<SvgIconAddSquare />} />
							</div>
						)}
						<InfiniteScrollWrapper
							dataLength={expDays.length}
							hasMore={hasMore}
							setCurrentPage={setCurrentPage}
						>
							<HistoryJarHead
								enableStatistics={expDays.length !== 0}
								OpenNewExpense={OpenNewExpense}
								OpenStatistics={OpenStatistics}
								OpenFilter={openFilter}
								jar={selectedJar}
								isFilters={isFilterActive}
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
								<ExpensesList expDays={expDays} ClickToExpenseEdit={ClickToExpenseEdit} />
							</div>
						</InfiniteScrollWrapper>
					</div>
				)}
		</div>
	);
};

export default HistoryJar;
