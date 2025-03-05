/* eslint-disable react/require-default-props */
import React, { ReactNode } from 'react';
import classNames from 'classnames';

interface HistoryJarButtonProps {
	children: ReactNode;
	onClick: () => void;
	ariaLabel: string;
	isActive?: boolean;
	className?: string;
}

const HistoryJarButton: React.FC<HistoryJarButtonProps> = ({
	children, onClick, ariaLabel, isActive = false, className = ''
}) => (
	<button
		className={classNames('history-jar__head-item', className, (isActive && 'history-jar__head-item_active'))}
		aria-label={ariaLabel}
		onClick={onClick}
	>
		{children}
	</button>
);

export default HistoryJarButton;
