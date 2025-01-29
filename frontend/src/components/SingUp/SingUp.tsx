import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { User, ValidateUser, ValidateUserField } from '../../validators/ValidateUser';
import { routeUserRegister } from '../../services/BackendUrl';
import { ErrorResponse } from '../../types/Error';
import PreAuthContent from '../PreAuthContent/PreAuthContent';
import breakpoints from '../../constants/breakpoints';
import useWidthWindow from '../../hooks/useWidthWindows';

enum ResultMessageType {
	error = 'error',
	success = 'success',
}

interface ResultResponse {
	result: string
}

const SingUp: React.FC = () => {
	const [message, setMessage] = useState('');
	const [messageStyle, setMessageStyle] = useState(ResultMessageType.error);
	const [regUser] = useState<User>({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		repeatPassword: ''
	});

	const { windowWidth } = useWidthWindow();
	const isMobile = windowWidth <= breakpoints.tablet;

	const DisplayMessage = (text: string, type: ResultMessageType) => {
		setMessageStyle(type);
		setMessage(text);
	};

	const SingUpClick = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		const errors = ValidateUser(regUser);
		if (errors !== undefined) {
			DisplayMessage(errors, ResultMessageType.error);
		} else {
			// Request to api
			const user = {
				firstName: regUser.firstName,
				lastName: regUser.lastName,
				email: regUser.email,
				password: regUser.password,
			};
			axios
				.post<ResultResponse>(routeUserRegister, user)
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
				});
		}
	};

	const OutFocus = (event: React.FormEvent<HTMLInputElement>) => {
		const inputName = event.currentTarget.name;
		const inputValue = event.currentTarget.value;
		DisplayMessage(ValidateUserField(inputName, inputValue, regUser), ResultMessageType.error);
	};

	const onFormChange = (event: React.FormEvent<HTMLInputElement>) => {
		const inputName = event.currentTarget.name;
		if (inputName in regUser) {
			regUser[inputName] = event.currentTarget.value;
		}
	};

	return (
		<section className="sing-up">
			<div className="sing-up__container">
				{!isMobile && <PreAuthContent />}
				<div className="sing-up__content">
					<div className="sing-up__wrap">
						<h2 className="sing-up__title">
							Sign Up
						</h2>
						<div className="sing-up__message">
							<p className={`sing-up__message_${messageStyle}`}>
								{message}
								&nbsp;
							</p>
						</div>
						<form id="sing-up" className="sing-up__form">
							<input
								required
								form="sing-up"
								placeholder="First Name"
								type="text"
								className="sing-up__input"
								name="firstName"
								onChange={onFormChange}
								onBlur={OutFocus}
							/>
							<input
								required
								form="sing-up"
								placeholder="Last Name"
								type="text"
								className="sing-up__input"
								name="lastName"
								onChange={onFormChange}
								onBlur={OutFocus}
							/>
							<input
								required
								onChange={onFormChange}
								formNoValidate
								form="sing-up"
								placeholder="mail.exemple@gmail.com"
								type="email"
								className="sing-up__input"
								name="email"
								onBlur={OutFocus}
							/>
							<input
								required
								onChange={onFormChange}
								onBlur={OutFocus}
								minLength={6}
								maxLength={10}
								form="sing-up"
								placeholder="Password"
								type="text"
								className="sing-up__input"
								name="password"
							/>
							<input
								required
								minLength={6}
								maxLength={10}
								form="sing-up"
								placeholder="Repeat the password"
								type="text"
								className="sing-up__input"
								name="repeatPassword"
								onChange={onFormChange}
								onBlur={OutFocus}
							/>
							<button className="sing-up__button" onClick={SingUpClick}>
								Sign Up
							</button>
						</form>
						<NavLink to="/user/login" className="greetings__button-signin">Already have an account? Sign In</NavLink>
					</div>
				</div>
			</div>
		</section>
	);
};

export default SingUp;
