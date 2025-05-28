import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PasswordInput from '../Auth/PasswordInput/PasswordInput';
import SettingsEditBase from '../SettingsEditBase/SettingsEditBase';
import SettingsEditField from '../SettingsEditField/SettingsEditField';
import isValidEditPassword from '../../validators/ValidateEditPassword';
import useAuthFormMessage from '../../hooks/useAuthFormMessage';
import { EditComponentType } from '../EditComponentsMap/types/EditComponentProps';
import AuthFormMessageType from '../../types/AuthFormMessageType';
import { IUser } from '../../interfaces/User';
import { loginSuccess } from '../../reducers/AuthReducer';
import authClient from '../../services/authClient';
import { apiUserUpdateProfile } from '../../services/BackendUrl';
import handleApiError from '../Auth/helpers/handleApiError';
import { IAuthState } from '../../interfaces/AuthState';

interface IEditPassword {
	currentPassword: string;
	newPassword: string;
}

const EditPassword: React.FC<EditComponentType> = ({ onCancel, setEditingSection }) => {
	const authUser = useSelector((state: IAuthState) => state.auth.user);
	const [password, setPassword] = useState<IEditPassword>({
		currentPassword: '',
		newPassword: ''
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const dispatch = useDispatch();

	const { message, displayMessage } = useAuthFormMessage();

	const handleBlur = () => {
		displayMessage(isValidEditPassword(password.newPassword), AuthFormMessageType.error);
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
			displayMessage(errors, AuthFormMessageType.error);
			return;
		}
		setIsLoading(true);
		authClient
			.patch<IUser>(`${apiUserUpdateProfile}/${authUser._id}`, password)
			.then((response) => {
				const responseData = response.data;
				dispatch(loginSuccess(responseData));
				setEditingSection(null);
			})
			.catch((error) => handleApiError(error, displayMessage))
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<SettingsEditBase
			onApply={handleApply}
			onCancel={onCancel}
			isLoading={isLoading}
			message={message}
		>
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
