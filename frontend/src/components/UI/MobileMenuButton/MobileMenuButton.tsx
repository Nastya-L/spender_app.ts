import React, { Dispatch, SetStateAction } from 'react';
import { SvgIconArrow } from '../SvgIcon/SvgIcon';

interface MobileMenuButtonProps {
	setIsOpen: Dispatch<SetStateAction<boolean>>,
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ setIsOpen }) => (
	<div className="mobile-menu-button">
		<button
			aria-label="arrow"
			className="mobile-menu-button__btn"
			onClick={() => setIsOpen(true)}
		>
			<SvgIconArrow />
		</button>

	</div>
);

export default MobileMenuButton;
