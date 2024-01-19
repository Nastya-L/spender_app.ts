import React, { useState } from 'react';
import { User, ValidateUser, ValidateUserField } from '../../validators/ValidateUser';

const SingUp: React.FC = () => {
	const [errorMessage, setErrorMessage] = useState('');
	const [regUser] = useState<User>({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		repeatPassword: ''
	});

	const SingUpClick = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		const error = ValidateUser(regUser);
		if (error !== undefined) {
			setErrorMessage(error);
		} else {
			// Request to api
			console.log(regUser);
		}
	};

	const OutFocus = (event: React.FormEvent<HTMLInputElement>) => {
		const inputName = event.currentTarget.name;
		const inputValue = event.currentTarget.value;
		setErrorMessage(ValidateUserField(inputName, inputValue, regUser));
	};

	const onFormChange = (event: React.FormEvent<HTMLInputElement>) => {
		const inputName = event.currentTarget.name;
		if (inputName in regUser) {
			regUser[inputName] = event.currentTarget.value;
		}
	};

	return (
		<div className="sing-up">
			<h2 className="sing-up__title">
				Sign Up
			</h2>
			<p className="sing-up__error">
				{errorMessage}
				&nbsp;
			</p>
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
			<a href="/" className="greetings__button-signin">Already have an account? Sign In</a>
		</div>
	);
};

export default SingUp;
