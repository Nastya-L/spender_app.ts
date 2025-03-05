import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { RootState } from '../../../store';
import AddExpenseButton from '../../UI/AddExpenseButton/AddExpenseButton';
import {
	SvgIconAdd, SvgIconDots, SvgIconUsers, SvgIconPen, SvgIconTrash, SvgIconInfo
} from '../../UI/SvgIcon/SvgIcon';
import HistoryJarButton from '../HistoryJarButton/HistoryJarButton';
import breakpoints from '../../../constants/breakpoints';
import useWidthWindow from '../../../hooks/useWidthWindows';
import { IAuthState } from '../../../interfaces/AuthState';
import { IExpense } from '../../../interfaces/Expense';
import { openModal } from '../../../reducers/ModalReducer';
import JarOptions from '../JarOptions/JarOptions';

interface HistoryJarHeaderProps {
	jarExpenses: IExpense[];
	OpenNewExpense: () => void;
	OpenStatistics: () => void;

}

const HistoryJarHeader: React.FC<HistoryJarHeaderProps> = ({
	jarExpenses, OpenNewExpense, OpenStatistics
}) => {
	const jars = useSelector((state: RootState) => state.jars.jars);
	const { id } = useParams();
	const dispatch = useDispatch();
	const userId = useSelector((state: IAuthState) => state.auth.user.id);
	const [jarOptionsIsOpen, setJarOptionsIsOpen] = useState(false);
	const selectedJar = (jars.find((jar) => jar._id === id));
	const jarName = selectedJar ? selectedJar.name : 'Oops';

	const { windowWidth } = useWidthWindow();
	const isMobile = windowWidth <= breakpoints.tablet;

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

	return (
		<div className="history-jar__head">
			<h2 className="history-jar__name">{jarName}</h2>
			{!isMobile
				&& <AddExpenseButton OpenNewExpense={OpenNewExpense} icon={<SvgIconAdd />} />}
			<div className={classNames('history-jar__head__menu', (jarOptionsIsOpen && 'history-jar__head__menu_active'))}>
				<HistoryJarButton ariaLabel="list" onClick={OpenJarOptions} isActive={jarOptionsIsOpen}>
					<SvgIconDots />
				</HistoryJarButton>
				<JarOptions jarOptionsIsOpen={jarOptionsIsOpen}>
					<HistoryJarButton ariaLabel="addUsers" onClick={ShareJar}>
						<SvgIconUsers />
					</HistoryJarButton>
					{selectedJar && selectedJar.owner === userId && (
						<>
							<HistoryJarButton ariaLabel="pen" onClick={EditJar}>
								<SvgIconPen />
							</HistoryJarButton>
							<HistoryJarButton ariaLabel="trash" onClick={DeleteJar}>
								<SvgIconTrash />
							</HistoryJarButton>
						</>
					)}
					{jarExpenses.length !== 0
						&& (
							<HistoryJarButton ariaLabel="info" onClick={OpenStatistics}>
								<SvgIconInfo />
							</HistoryJarButton>
						)}
				</JarOptions>
			</div>
		</div>
	);
};

export default HistoryJarHeader;
