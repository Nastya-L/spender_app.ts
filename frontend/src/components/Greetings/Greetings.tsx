import React from 'react';
import img from '../../images/greetings.png';
import GreetingsContent from '../GreetingsContent/GreetingsContent';

const Greetings: React.FC = () => (
	<section className="greetings">
		<div className="greetings__container">
			<div className="greetings__img">
				<div className="greetings__img-wrap">
					<img alt="greetings" src={img} />
				</div>
			</div>
			<div className="greetings__content">
				<GreetingsContent />
			</div>
		</div>
	</section>
);

export default Greetings;
