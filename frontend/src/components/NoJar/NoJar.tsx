import React from 'react';
import ButtonNewJar from '../UI/ButtonNewJar/ButtonNewJar';

const NoJar:React.FC = () => {
	console.log();

	return (
		<div className="no-jar">
			<div className="no-jar__container">
				<h2 className="no-jar__title">There are no jars</h2>
				<p className="no-jar__descr">We can’t found any jars:( But you can create new one right now</p>
				<ButtonNewJar nameClass="no-jar__add" />
			</div>
		</div>
	);
};

export default NoJar;
