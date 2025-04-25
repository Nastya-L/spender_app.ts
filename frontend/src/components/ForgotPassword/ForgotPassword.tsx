import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import breakpoints from '../../constants/breakpoints';
import useWidthWindow from '../../hooks/useWidthWindows';
import PreAuthContent from '../PreAuthContent/PreAuthContent';
import Spinner from '../UI/Spinner/Spinner';
import { ResultMessageType, ResultResponse } from '../SingUp/SingUp';
import { isValidEmail } from '../../validators/ValidateUser';
import { apiUserForgotPassword } from '../../services/BackendUrl';
import { ErrorResponse } from '../../types/Error';

const ForgotPassword: React.FC = () => {
	const [valueEmail, setValueEmail] = useState('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [message, setMessage] = useState('');
	const [messageStyle, setMessageStyle] = useState(ResultMessageType.error);

	const { windowWidth } = useWidthWindow();
	const isMobile = windowWidth <= breakpoints.tablet;

	const DisplayMessage = (text: string, type: ResultMessageType) => {
		setMessageStyle(type);
		setMessage(text);
	};

	const changeEmail = (e: React.FormEvent<HTMLInputElement>): void => {
		const EmailValue: string = e.currentTarget.value;
		setValueEmail(EmailValue);
	};

	const clickResetPassword = (event: React.MouseEvent<HTMLElement>): void => {
		event.preventDefault();
		const errors = isValidEmail(valueEmail);
		if (errors !== undefined) {
			DisplayMessage(errors, ResultMessageType.error);
		} else {
			const email = {
				email: valueEmail,
			};
			setIsLoading(true);
			axios
				.post<ResultResponse>(apiUserForgotPassword, email)
				.then((response) => {
					const responseData = response.data.result;
					DisplayMessage(responseData, ResultMessageType.success);
				}).catch((error) => {
					if (axios.isAxiosError<ErrorResponse, Record<string, unknown>>(error)) {
						if (error.response) {
							const errorResponse = error.response.data.error;
							DisplayMessage(errorResponse[0].msg, ResultMessageType.error);
						} else {
							DisplayMessage('Something went wrong', ResultMessageType.error);
						}
					}
				}).finally(() => {
					setIsLoading(false);
				});
		}
	};

	return (
		<section className="forgot-password">
			<div className="forgot-password__container">
				{!isMobile && <PreAuthContent />}
				<div className="forgot-password__content">
					<div className="forgot-password__wrap">
						<h2 className="forgot-password__title">Forgot Password</h2>
						<p className="forgot-password__desc">Enter your email</p>
						<div className="sing-up__message">
							<p className={`sing-up__message_${messageStyle}`}>
								{message}
								&nbsp;
							</p>
						</div>
						<form id="forgot-password" className="forgot-password__form">
							<input
								required
								onChange={changeEmail}
								formNoValidate
								form="forgot-password"
								placeholder="mail.exemple@gmail.com"
								type="email"
								className="forgot-password__input"
								disabled={messageStyle === ResultMessageType.success}
							/>
							<button
								type="submit"
								className="forgot-password__button"
								onClick={clickResetPassword}
								disabled={messageStyle === ResultMessageType.success}
							>
								<span className="spinner__wrapper">
									{isLoading && <Spinner />}
									Reset password
								</span>
							</button>
						</form>
					</div>
					<NavLink to="/user/login" className="greetings__button-signin">Remembered your password?</NavLink>
				</div>
			</div>
		</section>
	);
};

export default ForgotPassword;
