import React from 'react';

const GreetingsContent: React.FC = () => {
	const ClickStarted = () => {
		console.log('Click');
	};

	return (
		<div className="greetings__content-wrap">
			<h1 className="greetings__content-title">
				Spender
			</h1>
			<p className="greetings__content-descr">
				Do you enjoy spending money? Making impulsive purchases?
				Or do you save every penny? Simply log your expenses to see how much of a
				spender you are. Register now, it&apos;s easy and will only take a few minutes.
			</p>
			<button className="greetings__button">Get Started</button>
			<a href="/" className="greetings__button-signin">Already have an account? Sign In</a>
		</div>
	);
};

export default GreetingsContent;
