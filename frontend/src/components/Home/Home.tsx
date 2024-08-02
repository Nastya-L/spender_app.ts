import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ErrorResponse } from '../../types/Error';
import Sidebar from '../Sidebar/Sidebar';
import HistoryJar from '../HistoryJar/HistoryJar';
import { IAuthState } from '../../interfaces/AuthState';
import { IJar } from '../../interfaces/Jar';
import authClient, { IAuthClientError } from '../../services/authClient';
import NoJar from '../NoJar/NoJar';
import Modal from '../UI/Modal/Modal';

const Home:React.FC = () => {
	const navigate = useNavigate();
	const authState = useSelector((state: IAuthState) => state.auth.isAuthenticated);
	const [userJars, serUserJars] = useState<IJar[]>([]);

	useEffect(() => {
		if (!authState) {
			navigate('/');
			return;
		}
		authClient.get<Array<IJar>>('/jar')
			.then((response) => {
				const responseData = response.data;
				serUserJars(responseData);
			}).catch((error: IAuthClientError) => {
				if (error.redirect) {
					navigate(error.redirect);
					return;
				}
				if (axios.isAxiosError<ErrorResponse, Record<string, unknown>>(error)) {
					if (!error.response) {
						console.log('Something went wrong');
					}
				}
			});
	}, []);

	return (
		<main className="home">
			<Sidebar jars={userJars} />
			<div className="home__main">
				{(userJars.length > 0)
					? <HistoryJar />
					: <NoJar />}
				<Modal />
			</div>
		</main>
	);
};

export default Home;
