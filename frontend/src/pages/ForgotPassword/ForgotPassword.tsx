import React, { useState } from 'react';
import axios from 'axios';
import { isValidEmail } from '../../validators/ValidateUser';
import { apiUserForgotPassword } from '../../services/BackendUrl';
import AuthForm from '../../components/Auth/AuthForm';
import TextInput from '../../components/Auth/TextInput/TextInput';
import useAuthFormMessage from '../../hooks/useAuthFormMessage';
import handleApiError from '../../components/Auth/helpers/handleApiError';
import { UserActionFeedback } from '../../interfaces/UserActionFeedback';
import AuthFormMessageType from '../../types/AuthFormMessageType';

const ForgotPassword: React.FC = () => {
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { message, displayMessage } = useAuthFormMessage();

	const changeEmail = (e: React.FormEvent<HTMLInputElement>): void => {
		setEmail(e.currentTarget.value);
	};

	const handleBlur = () => {
		displayMessage(isValidEmail(email), AuthFormMessageType.error);
	};

	const handleResetPassword = (event: React.MouseEvent<HTMLElement>): void => {
		event.preventDefault();
		const errors = isValidEmail(email);
		if (errors !== undefined) {
			displayMessage(errors, AuthFormMessageType.error);
			return;
		}
		const request = {
			email,
		};
		setIsLoading(true);
		axios
			.post<UserActionFeedback>(apiUserForgotPassword, request)
			.then((response) => {
				const responseData = response.data.result;
				displayMessage(responseData, AuthFormMessageType.success);
			})
			.catch((error) => handleApiError(error, displayMessage))
			.finally(() => {
				setIsLoading(false);
			});
	};

	const links = [
		{
			text: 'Remembered your password?',
			to: '/user/login',
		},
	];

	return (
		<AuthForm
			title="Forgot Password"
			onSubmit={handleResetPassword}
			isLoading={isLoading}
			message={message}
			links={links}
			submitText="Reset password"
			disabled={message.style === AuthFormMessageType.success}
		>
			<p className="auth-form__desc">Enter your email</p>
			<TextInput
				name="email"
				placeholder="mail.exemple@gmail.com"
				onChange={changeEmail}
				onBlur={handleBlur}
				formId="forgot-password"
				type="text"
				disabled={message.style === AuthFormMessageType.success}
			/>
		</AuthForm>
	);
};

export default ForgotPassword;
