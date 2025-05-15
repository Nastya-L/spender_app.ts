import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiUserAuthorization } from '../../services/BackendUrl';
import { loginSuccess } from '../../reducers/AuthReducer';
import useAuthFormMessage from '../../hooks/useAuthFormMessage';
import handleApiError from '../../components/Auth/helpers/handleApiError';
import AuthForm from '../../components/Auth/AuthForm';
import TextInput from '../../components/Auth/TextInput/TextInput';
import PasswordInput from '../../components/Auth/PasswordInput/PasswordInput';
import { isValidEmail } from '../../validators/ValidateUser';
import { IUser } from '../../interfaces/User';
import AuthFormMessageType from '../../types/AuthFormMessageType';

const SingIn: React.FC = () => {
	const [valueEmail, setValueEmail] = useState('');
	const [valuePassword, setValuePassword] = useState('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { message, displayMessage } = useAuthFormMessage();

	const handleSignIn = (event: React.MouseEvent<HTMLElement>): void => {
		event.preventDefault();
		const errors = isValidEmail(valueEmail);
		if (errors !== undefined) {
			displayMessage(errors, AuthFormMessageType.error);
			return;
		}

		const LoginRequest = {
			email: valueEmail,
			password: valuePassword
		};
		setIsLoading(true);
		axios
			.post<IUser>(apiUserAuthorization, LoginRequest)
			.then((response) => {
				const responseData = response.data;
				dispatch(loginSuccess(responseData));
				navigate('/home');
			})
			.catch((error) => handleApiError(error, displayMessage))
			.finally(() => {
				setIsLoading(false);
			});
	};

	const changeEmail = (e: React.FormEvent<HTMLInputElement>): void => {
		const emailValue: string = e.currentTarget.value;
		setValueEmail(emailValue);
	};

	const changePassword = (e: React.FormEvent<HTMLInputElement>) => {
		const passwordValue: string = e.currentTarget.value;
		setValuePassword(passwordValue);
	};

	const handleBlur = () => {
		displayMessage(isValidEmail(valueEmail), AuthFormMessageType.error);
	};

	const links = [
		{
			text: 'Forgot your password?',
			to: '/user/forgot-password',
		},
		{
			text: 'Don\'t have an account? Sign up',
			to: '/user/register',
		}
	];

	return (
		<AuthForm
			title="Sign In"
			onSubmit={handleSignIn}
			isLoading={isLoading}
			message={message}
			links={links}
			submitText="Sign In"
		>
			<TextInput
				name="email"
				placeholder="mail.exemple@gmail.com"
				onChange={changeEmail}
				formId="form-sign-in"
				type="text"
				onBlur={handleBlur}
			/>
			<PasswordInput
				name="password"
				placeholder="**************"
				onChange={changePassword}
				formId="form-sign-in"
			/>
		</AuthForm>
	);
};

export default SingIn;
