import React, { useState } from 'react';
import { toast } from 'react-toastify';
import PasswordInput from '../Auth/PasswordInput/PasswordInput';
import SettingsEditBase from '../SettingsEditBase/SettingsEditBase';
import SettingsEditField from '../SettingsEditField/SettingsEditField';
import isValidEditPassword from '../../validators/ValidateEditPassword';

interface EditPasswordProps {
	onCancel: () => void;
}

interface IEditPassword {
	currentPassword: string;
	newPassword: string;
}

const EditPassword: React.FC<EditPasswordProps> = ({ onCancel }) => {
	const [password, setPassword] = useState<IEditPassword>({
		currentPassword: '',
		newPassword: ''
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleBlur = () => {
		toast.error(isValidEditPassword(password.newPassword));
	};

	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.currentTarget;

		setPassword((prev) => ({
			...prev,
			[name]: value
		}));
	};

	const handleApply = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		const errors = isValidEditPassword(password.newPassword);
		if (errors !== undefined) {
			toast.error(errors);
			return;
		}
		setIsLoading(true);
		console.log('Applying new password');
	};

	return (
		<SettingsEditBase onApply={handleApply} onCancel={onCancel} isLoading={isLoading}>
			<div className="settings-data-edit__wrapper__password">
				<SettingsEditField label="Current Password">
					<PasswordInput
						name="currentPassword"
						placeholder="Enter your current password"
						onChange={handleFormChange}
						onBlur={handleBlur}
						formId="edit-password"
					/>
				</SettingsEditField>

				<SettingsEditField label="Enter a new password">
					<PasswordInput
						name="newPassword"
						placeholder="Enter a new password"
						onChange={handleFormChange}
						onBlur={handleBlur}
						formId="edit-password"
					/>
				</SettingsEditField>
			</div>
		</SettingsEditBase>
	);
};

export default EditPassword;
