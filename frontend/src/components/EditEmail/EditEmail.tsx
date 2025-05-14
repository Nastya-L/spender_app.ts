import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { IAuthState } from '../../interfaces/AuthState';
import SettingsEditBase from '../SettingsEditBase/SettingsEditBase';
import SettingsEditField from '../SettingsEditField/SettingsEditField';
import TextInput from '../Auth/TextInput/TextInput';
import { isValidEmail } from '../../validators/ValidateUser';

interface EditEmailProps {
	onCancel: () => void;
}

const EditEmail: React.FC<EditEmailProps> = ({ onCancel }) => {
	const authUser = useSelector((state: IAuthState) => state.auth.user);
	const [email, setEmail] = useState<string>(authUser.email);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleEmailChange = (e: React.FormEvent<HTMLInputElement>): void => {
		setEmail(e.currentTarget.value);
	};

	const handleApply = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		const errors = isValidEmail(email);
		if (errors !== undefined) {
			toast.error(errors);
			return;
		}
		setIsLoading(true);
		console.log('Applying email changes', email);
	};

	return (
		<SettingsEditBase onApply={handleApply} onCancel={onCancel} isLoading={isLoading}>
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
