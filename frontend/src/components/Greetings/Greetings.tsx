import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import PreAuthContent from '../PreAuthContent/PreAuthContent';

const Greetings: React.FC = () => {
	const navigate = useNavigate();

	const ClickStarted = () => {
		navigate('/user/register');
	};

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
