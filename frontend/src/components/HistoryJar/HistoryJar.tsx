import React, {
	useEffect, useRef, useState
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RootState } from '../../store';
import { IAuthState } from '../../interfaces/AuthState';
import Expense from '../Expense/Expense';
import ExpenseRevers from '../ExpenseRevers/ExpenseRevers';
import ExpenseFormNew from '../ExpenseFormNew/ExpenseFormNew';
import ExpenseFormEdit from '../ExpenseFormEdit/ExpenseFormEdit';
import AddExpenseButton from '../UI/AddExpenseButton/AddExpenseButton';
import useWidthWindow from '../../hooks/useWidthWindows';
import breakpoints from '../../constants/breakpoints';
import JarStatistics from '../JarStatistics/JarStatistics';
import HistoryJarPreloader from '../UI/HistoryJarPreloader/HistoryJarPreloader';
import Spinner from '../UI/Spinner/Spinner';
import HistoryDay from './HistoryDay/HistoryDay';
import HistoryJarHeader from './HistoryJarHeader/HistoryJarHeader';
import { SvgIconAddSquare } from '../UI/SvgIcon/SvgIcon';
import useDialogueSection from '../../hooks/useDialogueSection';
import useExpenses from '../../hooks/useExpenses';

const HistoryJar: React.FC = () => {
	const [selectedExpenseId, setSelectedExpenseId] = useState('');
	const [isDialogueAnimationEnd, setIsDialogueAnimationEnd] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState(1);
	const { id } = useParams();
	const navigate = useNavigate();
	const authState = useSelector((state: IAuthState) => state.auth.isAuthenticated);
	const userId = useSelector((state: IAuthState) => state.auth.user.id);
	const jars = useSelector((state: RootState) => state.jars.jars);
	const refDialogueSection = useRef<HTMLDivElement>(null);

	const selectedJar = (jars.find((jar) => jar._id === id));

	const { windowWidth } = useWidthWindow();
	const isMobile = windowWidth <= breakpoints.tablet;

	const startPage: number = 1;

	const {
		CloseDialogueSection, OpenDialogueSection, isOpenDialogueSection, dialogueSection,
	} = useDialogueSection();

	const {
		jarExpenses,
		getExpenses,
		AddNewExpense,
		DeleteExpense,
		UpdateExpense,
		isLoading,
		errors,
		hasMore
	} = useExpenses();

	const nextPage = () => {
		setCurrentPage((prev) => prev + 1);
	};

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
		getExpenses(currentPage);
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
				isAnimationEnd: isDialogueAnimationEnd,
				close: CloseDialogueSection,
				AddNewExpense,
				errors,
				isLoading
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
				DeleteExpense,
				errors,
				isLoading
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
			{isLoading && jarExpenses.length === 0
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
							<HistoryJarHeader
								jarExpenses={jarExpenses}
								OpenNewExpense={OpenNewExpense}
								OpenStatistics={OpenStatistics}
							/>
							<div className="history-jar__body">
								{selectedJar && (
									<div
										className={classNames(((
											isOpenDialogueSection) ? 'dialogue-section_open' : 'dialogue-section'))}
										onTransitionEnd={() => {
											if (!isOpenDialogueSection) {
												OpenDialogueSection(undefined);
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
													errors={errors}
													isAnimationEnd={isDialogueAnimationEnd}
													isLoading={isLoading}
												/>
											)}
									</div>
								)}
								{(jarExpenses.length === 0)
									? <h3 className="history-day__not-found">No Expenses</h3>
									: jarExpenses.map((exp, i) => (
										<HistoryDay
											key={exp._id}
											expense={exp}
											index={i}
											jarExpenses={jarExpenses}
										>
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
										</HistoryDay>
									))}
							</div>
						</InfiniteScroll>
					</div>
				)}
		</div>
	);
};

export default HistoryJar;
