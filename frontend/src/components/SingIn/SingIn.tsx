import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { ErrorResponse } from '../../types/Error';
import PreAuthContent from '../PreAuthContent/PreAuthContent';
import { apiUserAuthorization } from '../../services/BackendUrl';
import { loginSuccess } from '../../reducers/AuthReducer';
import { IUser } from '../../interfaces/User';
import useWidthWindow from '../../hooks/useWidthWindows';
import breakpoints from '../../constants/breakpoints';
import { SvgIconEyeOff, SvgIconEyeShow } from '../UI/SvgIcon/SvgIcon';
import Spinner from '../UI/Spinner/Spinner';

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
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { windowWidth } = useWidthWindow();
	const isMobile = windowWidth <= breakpoints.tablet;

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
		setIsLoading(true);
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
			}).finally(() => {
				setIsLoading(false);
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
		const EmailValue: string = e.currentTarget.value;
		setValueEmail(EmailValue);
	};

	const changePassword = (e: React.FormEvent<HTMLInputElement>) => {
		const PasswordValue: string = e.currentTarget.value;
		setValuePassword(PasswordValue);
	};

	return (
		<section className="sing-in">
			<div className="sing-in__container">
				{!isMobile && <PreAuthContent />}
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
							<label className="sing-in__label" htmlFor="password">
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
								<button type="button" className="sing-in__img" aria-label="ShowPassword" onClick={ShowPassword}>
									{passVisible ? <SvgIconEyeShow /> : <SvgIconEyeOff />}
								</button>
							</label>
							<button className="sing-in__button" onClick={ClickSingIn}>
								<span className="spinner__wrapper">
									{isLoading && <Spinner />}
									Sign In
								</span>
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
