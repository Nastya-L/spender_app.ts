import React, { ReactNode } from 'react';
import classNames from 'classnames';

interface JarMenuButtonProps {
	children: ReactNode;
	onClick: () => void;
	ariaLabel: string;
	isActive?: boolean;
	className?: string;
}

const JarMenuButton: React.FC<JarMenuButtonProps> = ({
	children, onClick, ariaLabel, isActive, className
}) => (
	<button
		className={classNames('history-jar__head-item', className, (isActive && 'history-jar__head-item_active'))}
		aria-label={ariaLabel}
		onClick={onClick}
	>
		{children}
	</button>
);

JarMenuButton.defaultProps = {
	isActive: false,
	className: ''
};

export default JarMenuButton;
