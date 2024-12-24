import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { ErrorResponse } from '../../types/Error';
import PreAuthContent from '../PreAuthContent/PreAuthContent';
import { apiUserAuthorization } from '../../services/BackendUrl';
import { loginSuccess } from '../../reducers/AuthReducer';
import { IUser } from '../../interfaces/User';
import openEye from '../../images/icon/open-eye.png';
import eye from '../../images/icon/eye.png';

enum ResultMessageType {
	error = 'error',
	success = 'success',
}

const SingIn: React.FC = () => {
	const [passVisible, setPassVisible] = useState(false);
	const [valueEmail, setValueEmail] = useState('');
	const [valuePassword, setValuePassword] = useState('');

	const [messageServer, setMessageServer] = useState('');
	const [messageStyle, setMessageStyle] = useState(ResultMessageType.error);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const DisplayMessage = (text: string, type: ResultMessageType) => {
		setMessageStyle(type);
		setMessageServer(text);
	};

	const ClickSingIn = (event: React.MouseEvent<HTMLElement>): void => {
		event.preventDefault();
		const message = {
			email: valueEmail,
			password: valuePassword
		};
		axios
			.post<IUser>(apiUserAuthorization, message)
			.then((response) => {
				const responseData = response.data;
				dispatch(loginSuccess(responseData));
				navigate('/home');
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
	};

	const ShowPassword = (event: React.MouseEvent<HTMLElement>): void => {
		event.preventDefault();
		if (passVisible) {
			setPassVisible(false);
		} else {
			setPassVisible(true);
		}
	};

	const changeEmail = (e: React.FormEvent<HTMLInputElement>): void => {
		const EmailValue:string = e.currentTarget.value;
		setValueEmail(EmailValue);
	};

	const changePassword = (e: React.FormEvent<HTMLInputElement>) => {
		const PasswordValue:string = e.currentTarget.value;
		setValuePassword(PasswordValue);
	};

	return (
		<section className="sing-in">
			<div className="sing-in__container">
				<PreAuthContent />
				<div className="sing-in__content">
					<div className="sing-in__wrap">
						<h2 className="sing-in__title">
							Sign in
						</h2>
						<div className="sing-up__message">
							<p className={`sing-up__message_${messageStyle}`}>
								{messageServer}
								&nbsp;
							</p>
						</div>
						<form id="sing-in" className="sing-in__form">
							<input
								required
								onChange={changeEmail}
								formNoValidate
								form="sing-in"
								placeholder="mail.exemple@gmail.com"
								type="text"
								className="sing-in__input"
							/>
							<input
								required
								onChange={changePassword}
								minLength={6}
								maxLength={10}
								form="sing-in"
								placeholder="**************"
								type={passVisible ? 'text' : 'password'}
								className="sing-in__input password"
							/>
							<button className="sing-in__img" aria-label="ShowPassword" onClick={ShowPassword}>
								<img
									alt="eye"
									src={passVisible ? openEye : eye}
								/>
							</button>
							<button className="sing-in__button" onClick={ClickSingIn}>
								Sign In
							</button>
						</form>
						<NavLink to="/user/register" className="greetings__button-signin">Don&lsquo;t have an account? Sign up</NavLink>
					</div>
				</div>
			</div>
		</section>
	);
};

export default SingIn;
