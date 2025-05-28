/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { ReactNode, useState } from 'react';
import { SvgIconArrow } from '../UI/SvgIcon/SvgIcon';

interface SettingsItemWrapperProps {
	children: ReactNode;
	title: string;
	desc: string;
}

const SettingsItemWrapper: React.FC<SettingsItemWrapperProps> = ({
	children, title, desc
}) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<div className="settings-item-wrapper">
			<details
				className="settings-item-wrapper__container"
				open={isOpen}
			>
				<summary
					className="settings-item-wrapper__summary"
					onClick={(e) => {
						e.preventDefault();
						setIsOpen(!isOpen);
					}}
				>
					<div className="settings-item-wrapper__header">
						<h3 className="settings-item-wrapper__title">{title}</h3>
						<div className="settings-item-wrapper__icon">
							<SvgIconArrow />
						</div>
					</div>
					<div className={isOpen ? 'settings-item-wrapper__none' : 'settings-item-wrapper__desc'}>
						<p className="settings-item-wrapper__text">{desc}</p>
					</div>
				</summary>
				{children}
			</details>
		</div>
	);
};

export default SettingsItemWrapper;
