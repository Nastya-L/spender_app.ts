import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import PreAuthContent from '../PreAuthContent/PreAuthContent';
import breakpoints from '../../constants/breakpoints';
import useWidthWindow from '../../hooks/useWidthWindows';
import { ResultMessageType, ResultResponse } from '../SingUp/SingUp';
import Spinner from '../UI/Spinner/Spinner';
import { ErrorResponse } from '../../types/Error';
import { SvgIconEyeOff, SvgIconEyeShow } from '../UI/SvgIcon/SvgIcon';
import { isValidPassword } from '../../validators/ValidateUser';
import { apiUserResetPassword } from '../../services/BackendUrl';

interface IPassword {
	password: string;
	repeatPassword: string;
	[key: string]: string;
}

const ResetPassword: React.FC = () => {
	const [passVisiblePassword, setPassVisiblePassword] = useState(false);
	const [passVisibleRepeat, setPassVisibleRepeat] = useState(false);
	const [valuePassword] = useState<IPassword>({
		password: '',
		repeatPassword: ''
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [message, setMessage] = useState('');
	const [messageStyle, setMessageStyle] = useState(ResultMessageType.error);
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token');
	const navigate = useNavigate();

	const { windowWidth } = useWidthWindow();
	const isMobile = windowWidth <= breakpoints.tablet;

	const displayMessage = (text: string, type: ResultMessageType) => {
		setMessageStyle(type);
		setMessage(text);
	};

	const OutFocus = () => {
		displayMessage(
			isValidPassword(valuePassword.password, valuePassword.repeatPassword),
			ResultMessageType.error
		);
	};

	const onFormChange = (event: React.FormEvent<HTMLInputElement>) => {
		const inputName: string = event.currentTarget.name;
		if (inputName in valuePassword) {
			valuePassword[inputName] = event.currentTarget.value;
		}
	};

	const clickResetPassword = (event: React.MouseEvent<HTMLElement>): void => {
		event.preventDefault();
		const errors = isValidPassword(valuePassword.password, valuePassword.repeatPassword);
		if (errors !== undefined) {
			displayMessage(errors, ResultMessageType.error);
		} else {
			const newPassword = {
				token,
				newPassword: valuePassword.password,
			};
			setIsLoading(true);
			axios
				.post<ResultResponse>(apiUserResetPassword, newPassword)
				.then((response) => {
					const responseData = response.data.result;
					toast.success(responseData);
					navigate('/home');
				}).catch((error) => {
					if (axios.isAxiosError<ErrorResponse, Record<string, unknown>>(error)) {
						if (error.response) {
							const errorResponse = error.response.data.error;
							displayMessage(errorResponse[0].msg, ResultMessageType.error);
						} else {
							displayMessage('Something went wrong', ResultMessageType.error);
						}
					}
				}).finally(() => {
					setIsLoading(false);
				});
		}
	};

	return (
		<section className="reset-password">
			<div className="reset-password__container">
				{!isMobile && <PreAuthContent />}
				<div className="reset-password__content">
					<div className="reset-password__wrap">
						<h2 className="reset-password__title">Reset Password</h2>
						<div className="sing-up__message">
							<p className={`sing-up__message_${messageStyle}`}>
								{message}
								&nbsp;
							</p>
						</div>
						<form id="reset-password" className="reset-password__form">
							<label className="reset-password__label" htmlFor="password">
								<p className="reset-password__desc">Enter a new password</p>
								<input
									required
									name="password"
									onChange={onFormChange}
									onBlur={OutFocus}
									minLength={6}
									maxLength={10}
									form="reset-password"
									placeholder="**************"
									type={passVisiblePassword ? 'text' : 'password'}
									className="reset-password__input password"
									disabled={messageStyle === ResultMessageType.success}
								/>
								<button
									type="button"
									className="reset-password__img"
									aria-label="ShowPassword"
									onClick={() => setPassVisiblePassword(!passVisiblePassword)}
								>
									{passVisiblePassword ? <SvgIconEyeShow /> : <SvgIconEyeOff />}
								</button>
							</label>
							<label className="reset-password__label" htmlFor="password">
								<p className="reset-password__desc">Repeat the new password</p>
								<input
									required
									name="repeatPassword"
									onChange={onFormChange}
									onBlur={OutFocus}
									minLength={6}
									maxLength={10}
									form="reset-password"
									placeholder="**************"
									type={passVisibleRepeat ? 'text' : 'password'}
									className="reset-password__input password"
									disabled={messageStyle === ResultMessageType.success}
								/>
								<button
									type="button"
									className="reset-password__img"
									aria-label="ShowPassword"
									onClick={() => setPassVisibleRepeat(!passVisibleRepeat)}
								>
									{passVisibleRepeat ? <SvgIconEyeShow /> : <SvgIconEyeOff />}
								</button>
							</label>
							<button
								type="submit"
								className="reset-password__button"
								onClick={clickResetPassword}
							>
								<span className="spinner__wrapper">
									{isLoading && <Spinner />}
									Save and Log in
								</span>
							</button>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ResetPassword;
