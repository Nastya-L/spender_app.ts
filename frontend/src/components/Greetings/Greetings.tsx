import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import PreAuthContent from '../PreAuthContent/PreAuthContent';
import { IAuthState } from '../../interfaces/AuthState';

const Greetings: React.FC = () => {
	const navigate = useNavigate();
	const authUser = useSelector((state: IAuthState) => state.auth.user);

	const ClickStarted = () => {
		navigate('/user/register');
	};

	useEffect(() => {
		if (authUser) {
			navigate('/home');
		}
	}, []);

	return (
		<section className="greetings">
			<div className="greetings__container">
				<PreAuthContent />
				<div className="greetings__content">
					<div className="greetings__content-wrap">
						<h1 className="greetings__content-title">
							Spender
						</h1>
						<p className="greetings__content-descr">
							Do you enjoy spending money? Making impulsive purchases?
							Or do you save every penny? Simply log your expenses to see how much of a
							spender you are. Register now, it&apos;s easy and will only take a few minutes.
						</p>
						<button className="greetings__button" onClick={ClickStarted}>Get Started</button>
						<NavLink to="/user/login" className="greetings__button-signin">Already have an account? Sign In</NavLink>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Greetings;
