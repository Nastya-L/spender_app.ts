import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IAuthState } from '../../interfaces/AuthState';
import SettingsEditBase from '../SettingsEditBase/SettingsEditBase';
import SettingsEditField from '../SettingsEditField/SettingsEditField';
import TextInput from '../Auth/TextInput/TextInput';
import { isValidFirstLastNames } from '../../validators/ValidateUser';
import { IUser } from '../../interfaces/User';
import { apiUserUpdateProfile } from '../../services/BackendUrl';
import authClient from '../../services/authClient';
import { loginSuccess } from '../../reducers/AuthReducer';
import useAuthFormMessage from '../../hooks/useAuthFormMessage';
import handleApiError from '../Auth/helpers/handleApiError';
import AuthFormMessageType from '../../types/AuthFormMessageType';
import { EditComponentType } from '../EditComponentsMap/types/EditComponentProps';

const EditPersonalData: React.FC<EditComponentType> = ({ onCancel, setEditingSection }) => {
	const authUser = useSelector((state: IAuthState) => state.auth.user);
	const [lastName, setLastName] = useState(authUser.lastName);
	const [firstName, setFirstName] = useState(authUser.firstName);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const dispatch = useDispatch();

	const { message, displayMessage } = useAuthFormMessage();

	const handleInputChangeLastName = (event: React.FormEvent<HTMLInputElement>) => {
		const { value } = event.currentTarget;
		setLastName(value);
	};

	const handleInputChangeFirstName = (event: React.FormEvent<HTMLInputElement>) => {
		const { value } = event.currentTarget;
		setFirstName(value);
	};

	const handleApply = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		const errorsFirstName = isValidFirstLastNames(firstName);
		const errorsLastName = isValidFirstLastNames(lastName);
		if (errorsFirstName !== undefined) {
			displayMessage(errorsFirstName, AuthFormMessageType.error);
			return;
		}
		if (errorsLastName !== undefined) {
			displayMessage(errorsLastName, AuthFormMessageType.error);
			return;
		}
		setIsLoading(true);
		const userData = {
			firstName,
			lastName
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
			<SettingsEditField label="First Name">
				<TextInput
					formId="First Name"
					placeholder="First Name"
					onChange={handleInputChangeFirstName}
					type="text"
					name="First Name"
					value={firstName}
				/>
			</SettingsEditField>
			<SettingsEditField label="Last Name">
				<TextInput
					formId="Last Name"
					name="Last Name"
					placeholder="Last Name"
					onChange={handleInputChangeLastName}
					value={lastName}
					type="text"
				/>
			</SettingsEditField>
		</SettingsEditBase>
	);
};

export default EditPersonalData;
