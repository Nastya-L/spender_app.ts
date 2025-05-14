import React from 'react';
import Spinner from '../UI/Spinner/Spinner';

interface SettingsEditBaseProps {
	onApply: (event: React.MouseEvent<HTMLElement>) => void;
	onCancel: () => void;
	children: React.ReactNode;
	isLoading: boolean;
}

const SettingsEditBase: React.FC<SettingsEditBaseProps> = ({
	onApply, onCancel, children, isLoading
}) => (
	<div className="settings-data-edit">
		<div className="settings-data-edit__wrapper">
			{children}
		</div>
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
);

export default SettingsEditBase;
