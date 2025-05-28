import React from 'react';
import Spinner from '../UI/Spinner/Spinner';
import { IMessage } from '../../hooks/useAuthFormMessage';

interface SettingsEditBaseProps {
	onApply: (event: React.MouseEvent<HTMLElement>) => void;
	onCancel: () => void;
	children: React.ReactNode;
	isLoading: boolean;
	message: IMessage;
}

const SettingsEditBase: React.FC<SettingsEditBaseProps> = ({
	onApply, onCancel, children, isLoading, message
}) => (
	<div className="settings-data-edit">
		<div className="settings-data-edit__message">
			<p className={`settings-data-edit__message_${message.style}`}>
				{message.text}
				&nbsp;
			</p>
		</div>
		<div className="settings-data-edit__wrapper">
			{children}
			<div className="settings-data-edit__actions">
				<button
					onClick={onApply}
					className="settings-data-edit__button settings-data-edit__button_apply"
				>
					<span className="spinner__wrapper">
						{isLoading && <Spinner />}
						Apply
					</span>
				</button>
				<button
					onClick={onCancel}
					type="submit"
					className="settings-data-edit__button settings-data-edit__button_cancel"
				>
					Cancel
				</button>
			</div>
		</div>
	</div>
);

export default SettingsEditBase;
