import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import HistoryJar from '../HistoryJar/HistoryJar';

const Home:React.FC = () => {
	console.log();

	return (
		<main className="home">
			<Sidebar />
			<div className="home__main">
				<HistoryJar />
			</div>
		</main>
	);
};

export default Home;
