import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IAuthState } from '../../interfaces/AuthState';
import SettingsEditBase from '../SettingsEditBase/SettingsEditBase';
import SettingsEditField from '../SettingsEditField/SettingsEditField';
import TextInput from '../Auth/TextInput/TextInput';
import { isValidEmail } from '../../validators/ValidateUser';
import useAuthFormMessage from '../../hooks/useAuthFormMessage';
import { EditComponentType } from '../EditComponentsMap/types/EditComponentProps';
import AuthFormMessageType from '../../types/AuthFormMessageType';
import authClient from '../../services/authClient';
import { IUser } from '../../interfaces/User';
import { apiUserUpdateProfile } from '../../services/BackendUrl';
import { loginSuccess } from '../../reducers/AuthReducer';
import handleApiError from '../Auth/helpers/handleApiError';

const EditEmail: React.FC<EditComponentType> = ({ onCancel, setEditingSection }) => {
	const authUser = useSelector((state: IAuthState) => state.auth.user);
	const [email, setEmail] = useState<string>(authUser.email);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const dispatch = useDispatch();

	const { message, displayMessage } = useAuthFormMessage();

	const handleEmailChange = (e: React.FormEvent<HTMLInputElement>): void => {
		setEmail(e.currentTarget.value);
	};

	const handleApply = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		const errors = isValidEmail(email);
		if (errors !== undefined) {
			displayMessage(errors, AuthFormMessageType.error);
			return;
		}
		setIsLoading(true);
		const userData = {
			email
		};
		authClient
			.patch<IUser>(`${apiUserUpdateProfile}/${authUser._id}`, userData)
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
			<SettingsEditField label="Email">
				<TextInput
					formId="EditEmail"
					placeholder="Email"
					onChange={handleEmailChange}
					type="email"
					name="email"
					value={email}
				/>
			</SettingsEditField>
		</SettingsEditBase>
	);
};

export default EditEmail;
