import React, { useState } from 'react';
import axios from 'axios';
import { User, ValidateUser, ValidateUserField } from '../../validators/ValidateUser';
import { routeUserRegister } from '../../services/BackendUrl';
import AuthForm from '../../components/Auth/AuthForm';
import useAuthFormMessage from '../../hooks/useAuthFormMessage';
import handleApiError from '../../components/Auth/helpers/handleApiError';
import TextInput from '../../components/Auth/TextInput/TextInput';
import PasswordInput from '../../components/Auth/PasswordInput/PasswordInput';
import { UserActionFeedback } from '../../interfaces/UserActionFeedback';
import AuthFormMessageType from '../../types/AuthFormMessageType';

const SingUp: React.FC = () => {
	const [regUser] = useState<User>({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		repeatPassword: ''
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { message, displayMessage } = useAuthFormMessage();

	const handleSignUp = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		const errors = ValidateUser(regUser);
		if (errors !== undefined) {
			displayMessage(errors, AuthFormMessageType.error);
			return;
		}

		const user = {
			firstName: regUser.firstName,
			lastName: regUser.lastName,
			email: regUser.email,
			password: regUser.password,
		};
		setIsLoading(true);
		axios
			.post<UserActionFeedback>(routeUserRegister, user)
			.then((response) => {
				const responseData = response.data.result;
				displayMessage(responseData, AuthFormMessageType.success);
			})
			.catch((error) => handleApiError(error, displayMessage))
			.finally(() => {
				setIsLoading(false);
			});
	};

	const handleBlur = (event: React.FormEvent<HTMLInputElement>) => {
		const inputName = event.currentTarget.name;
		const inputValue = event.currentTarget.value;
		displayMessage(ValidateUserField(inputName, inputValue, regUser), AuthFormMessageType.error);
	};

	const handleFormChange = (event: React.FormEvent<HTMLInputElement>) => {
		const inputName = event.currentTarget.name;
		if (inputName in regUser) {
			regUser[inputName] = event.currentTarget.value;
		}
	};

	const links = [
		{
			text: 'Already have an account? Sign In',
			to: '/user/login',
		}
	];

	return (
		<AuthForm
			title="Sign Up"
			onSubmit={handleSignUp}
			isLoading={isLoading}
			message={message}
			links={links}
			submitText="Sign Up"
		>
			<TextInput
				name="firstName"
				placeholder="First Name"
				onChange={handleFormChange}
				onBlur={handleBlur}
				formId="form-sign-up"
			/>
			<TextInput
				name="lastName"
				placeholder="Last Name"
				onChange={handleFormChange}
				onBlur={handleBlur}
				formId="form-sign-up"
			/>
			<TextInput
				name="email"
				placeholder="mail.exemple@gmail.com"
				onChange={handleFormChange}
				onBlur={handleBlur}
				formId="form-sign-up"
				type="email"
			/>
			<PasswordInput
				name="password"
				placeholder="Password"
				onChange={handleFormChange}
				onBlur={handleBlur}
				formId="form-sign-up"
			/>
			<PasswordInput
				name="repeatPassword"
				placeholder="Repeat the password"
				onChange={handleFormChange}
				onBlur={handleBlur}
				formId="form-sign-up"
			/>
		</AuthForm>
	);
};

export default SingUp;
