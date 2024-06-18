import React from 'react';
import Sidebar from '../Sidebar/Sidebar';

const Home:React.FC = () => {
	console.log();

	return (
		<main className="home">
			<Sidebar />
			<div className="home__content-mock">
				<div>
					&nbsp;
				</div>
			</div>
		</main>
	);
};

export default Home;
