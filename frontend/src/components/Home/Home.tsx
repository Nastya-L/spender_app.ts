import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import HistoryJar from '../HistoryJar/HistoryJar';
import { IAuthState } from '../../interfaces/AuthState';

const Home:React.FC = () => {
	const navigate = useNavigate();
	const authState = useSelector<IAuthState>((state) => state.auth.isAuthenticated);

	useEffect(() => {
		if (!authState) {
			navigate('/');
		}
	}, []);

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
