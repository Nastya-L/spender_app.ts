import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { IAuthState } from '../../interfaces/AuthState';
import SettingsEditBase from '../SettingsEditBase/SettingsEditBase';
import SettingsEditField from '../SettingsEditField/SettingsEditField';
import TextInput from '../Auth/TextInput/TextInput';
import { isValidFirstLastNames } from '../../validators/ValidateUser';

interface EditPersonalDataProps {
	onCancel: () => void;
}

const EditPersonalData: React.FC<EditPersonalDataProps> = ({ onCancel }) => {
	const authUser = useSelector((state: IAuthState) => state.auth.user);
	const [userData, setUserData] = useState({
		firstName: authUser.firstName,
		lastName: authUser.lastName
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
		const { name, value } = event.currentTarget;

		setUserData((prev) => ({
			...prev,
			[name]: value
		}));
	};

	const handleApply = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		const errorsFirstName = isValidFirstLastNames(userData.firstName);
		const errorsLastName = isValidFirstLastNames(userData.lastName);
		if (errorsFirstName !== undefined) {
			toast.error(errorsFirstName);
			return;
		}
		if (errorsLastName !== undefined) {
			toast.error(errorsFirstName);
			return;
		}
		setIsLoading(true);
		console.log('Applying personal data changes', userData);
	};

	return (
		<SettingsEditBase onApply={handleApply} onCancel={onCancel} isLoading={isLoading}>
			<SettingsEditField label="First Name">
				<TextInput
					formId="Last Name"
					placeholder="First Name"
					onChange={handleInputChange}
					type="text"
					name="First Name"
					value={userData.firstName}
				/>
			</SettingsEditField>

			<SettingsEditField label="Last Name">
				<TextInput
					formId="Last Name"
					name="Last Name"
					placeholder="Last Name"
					onChange={handleInputChange}
					value={userData.lastName}
					type="text"
				/>
			</SettingsEditField>
		</SettingsEditBase>
	);
};

export default EditPersonalData;
