import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import AddExpenseButton from '../../UI/AddExpenseButton/AddExpenseButton';
import {
	SvgIconAdd, SvgIconDots, SvgIconUsers, SvgIconPen, SvgIconTrash, SvgIconInfo
} from '../../UI/SvgIcon/SvgIcon';
import JarMenuButton from '../JarMenuButton/JarMenuButton';
import breakpoints from '../../../constants/breakpoints';
import useWidthWindow from '../../../hooks/useWidthWindows';
import { IAuthState } from '../../../interfaces/AuthState';
import { openModal } from '../../../reducers/ModalReducer';
import { IJar } from '../../../interfaces/Jar';

interface HistoryJarHeaderProps {
	enableStatistics: boolean;
	OpenNewExpense: () => void;
	OpenStatistics: () => void;
	jar: IJar;
}

const HistoryJarHead: React.FC<HistoryJarHeaderProps> = ({
	enableStatistics, OpenNewExpense, OpenStatistics, jar
}) => {
	const dispatch = useDispatch();
	const userId = useSelector((state: IAuthState) => state.auth.user.id);
	const [jarOptionsIsOpen, setJarOptionsIsOpen] = useState(false);

	const jarName = useMemo(() => (jar ? jar.name : 'Oops'), [jar]);
	const isOwner = useMemo(() => jar && jar.owner === userId, [jar, userId]);

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
				<JarMenuButton
					ariaLabel="list"
					onClick={OpenJarOptions}
					isActive={jarOptionsIsOpen}
					className="history-jar__head-item_more"
				>
					<SvgIconDots />
				</JarMenuButton>
				<div className={classNames((jarOptionsIsOpen === true ? 'history-jar__head__menu__open' : 'none'))}>
					<div className="history-jar__head__menu__items">
						<JarMenuButton ariaLabel="addUsers" onClick={ShareJar}>
							<SvgIconUsers />
						</JarMenuButton>
						{isOwner && (
							<>
								<JarMenuButton ariaLabel="pen" onClick={EditJar}>
									<SvgIconPen />
								</JarMenuButton>
								<JarMenuButton ariaLabel="trash" onClick={DeleteJar}>
									<SvgIconTrash />
								</JarMenuButton>
							</>
						)}
						{enableStatistics
							&& (
								<JarMenuButton ariaLabel="info" onClick={OpenStatistics}>
									<SvgIconInfo />
								</JarMenuButton>
							)}
					</div>
				</div>

			</div>
		</div>
	);
};

export default HistoryJarHead;
