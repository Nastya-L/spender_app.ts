import React from 'react';
import Spinner from '../Spinner/Spinner';
import { SvgIconTrash } from '../SvgIcon/SvgIcon';

interface ActionButtonProps {
	text: string;
	isLoading: boolean;
	onClick: () => void;
}

export const ActionSubmitButton: React.FC<ActionButtonProps> = ({
	text, isLoading, onClick
}) => (
	<button onClick={onClick} className="action-button">
		<span className="spinner__wrapper">
			{isLoading && <Spinner />}
			{text}
		</span>
	</button>
);

export const ActionRemoveButton: React.FC<ActionButtonProps> = ({
	text, isLoading, onClick
}) => (
	<button onClick={onClick} className="action-button-delete">
		{isLoading
			? <div className="action-button-delete__loading"><Spinner /></div>
			: <SvgIconTrash />}
		{text}
	</button>
);
