import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { isValidPassword } from '../../validators/ValidateUser';
import { apiUserResetPassword } from '../../services/BackendUrl';
import useAuthFormMessage from '../../hooks/useAuthFormMessage';
import AuthForm from '../../components/Auth/AuthForm';
import PasswordInput from '../../components/Auth/PasswordInput/PasswordInput';
import handleApiError from '../../components/Auth/helpers/handleApiError';
import { UserActionFeedback } from '../../interfaces/UserActionFeedback';
import AuthFormMessageType from '../../types/AuthFormMessageType';

interface IPassword {
	password: string;
	repeatPassword: string;
	[key: string]: string;
}

const ResetPassword: React.FC = () => {
	const [newPassword] = useState<IPassword>({
		password: '',
		repeatPassword: ''
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token');
	const navigate = useNavigate();

	const { message, displayMessage } = useAuthFormMessage();

	const handleBlur = () => {
		displayMessage(
			isValidPassword(newPassword.password, newPassword.repeatPassword),
			AuthFormMessageType.error
		);
	};

	const handleFormChange = (event: React.FormEvent<HTMLInputElement>) => {
		const inputName: string = event.currentTarget.name;
		if (inputName in newPassword) {
			newPassword[inputName] = event.currentTarget.value;
		}
	};

	const handleResetPassword = (event: React.MouseEvent<HTMLElement>): void => {
		event.preventDefault();
		const errors = isValidPassword(newPassword.password, newPassword.repeatPassword);
		if (errors !== undefined) {
			displayMessage(errors, AuthFormMessageType.error);
			return;
		}
		if (!token) {
			displayMessage('Incorrect URL', AuthFormMessageType.error);
			return;
		}
		const resetRequest = {
			token,
			password: newPassword.password,
		};
		setIsLoading(true);
		axios
			.post<UserActionFeedback>(apiUserResetPassword, resetRequest)
			.then((response) => {
				const responseData = response.data.result;
				toast.success(responseData);
				navigate('/user/login');
			})
			.catch((error) => handleApiError(error, displayMessage))
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<AuthForm
			title="Reset Password"
			onSubmit={handleResetPassword}
			isLoading={isLoading}
			message={message}
			submitText="Save"
		>
			<PasswordInput
				name="password"
				placeholder="Enter a new password"
				onChange={handleFormChange}
				onBlur={handleBlur}
				formId="reset-password"
			/>
			<PasswordInput
				name="password"
				placeholder="Repeat the new password"
				onChange={handleFormChange}
				onBlur={handleBlur}
				formId="reset-password"
			/>
		</AuthForm>
	);
};

export default ResetPassword;
