import React, { ReactNode, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PreAuthContent from '../PreAuthContent/PreAuthContent';
import breakpoints from '../../constants/breakpoints';
import useWidthWindow from '../../hooks/useWidthWindows';
import Spinner from '../UI/Spinner/Spinner';
import { IAuthState } from '../../interfaces/AuthState';
import { IMessage } from '../../hooks/useAuthFormMessage';

interface AuthLink {
	text: string;
	to: string;
}

interface AuthFormProps {
	title: string;
	submitText: string;
	children: ReactNode;
	onSubmit: (event: React.MouseEvent<HTMLElement>) => void;
	isLoading: boolean;
	message: IMessage;
	links?: AuthLink[];
	disabled?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({
	title,
	submitText,
	children,
	onSubmit,
	isLoading,
	message,
	links,
	disabled
}) => {
	const authUser = useSelector((state: IAuthState) => state.auth.user);
	const navigate = useNavigate();
	const { windowWidth } = useWidthWindow();
	const isMobile = windowWidth <= breakpoints.tablet;

	useEffect(() => {
		if (authUser) {
			navigate('/home');
		}
	}, []);

	return (
		<section className="auth-form">
			<div className="auth-form__container">
				{!isMobile && <PreAuthContent />}
				<div className="auth-form__content">
					<div className="auth-form__wrap">
						<h2 className="auth-form__title">
							{title}
						</h2>
						<div className="auth-form__message">
							<p className={`auth-form__message_${message.style}`}>
								{message.text}
								&nbsp;
							</p>
						</div>
						<form id={`form-${title.toLowerCase().replace(' ', '-')}`} className="auth-form__form">
							{children}
							<button
								className="auth-form__button"
								onClick={onSubmit}
								type="submit"
								disabled={disabled}
							>
								<span className="spinner__wrapper">
									{isLoading && <Spinner />}
									{submitText}
								</span>
							</button>
						</form>
						{links?.map((link) => (
							<NavLink key={link.to} to={link.to} className="auth-form__link">
								{link.text}
							</NavLink>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

AuthForm.defaultProps = {
	disabled: false,
	links: []
};

export default AuthForm;
