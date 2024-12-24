import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ErrorResponse } from '../../types/Error';
import Sidebar from '../Sidebar/Sidebar';
import HistoryJar from '../HistoryJar/HistoryJar';
import { IAuthState } from '../../interfaces/AuthState';
import { IJar } from '../../interfaces/Jar';
import authClient, { IAuthClientError } from '../../services/authClient';
import NoJar from '../NoJar/NoJar';
import Modal from '../UI/Modal/Modal';
import { setJars } from '../../reducers/JarsReducer';
import { RootState } from '../../store';

const Home:React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { id } = useParams();
	const authState = useSelector((state: IAuthState) => state.auth.isAuthenticated);
	const jars = useSelector((state: RootState) => state.jars.jars);

	useEffect(() => {
		if (!authState) {
			navigate('/');
			return;
		}
		authClient.get<Array<IJar>>('/jar')
			.then((response) => {
				const responseData = response.data;
				dispatch(setJars(responseData));
			}).catch((error: IAuthClientError) => {
				if (error.redirect) {
					navigate(error.redirect);
					return;
				}
				if (axios.isAxiosError<ErrorResponse, Record<string, unknown>>(error)) {
					if (!error.response) {
						toast.error('Something went wrong');
					}
				}
			});
	}, []);

	useEffect(() => {
		if (jars.length > 0) {
			if (!id) {
				navigate(`/home/jar/${jars[0]._id}`);
			}
		}
	}, [jars]);

	return (
		<main className="home">
			<Sidebar jars={jars} />
			<div className="home__main">
				{(jars.length > 0)
					? <HistoryJar />
					: <NoJar />}
				<Modal />
			</div>
		</main>
	);
};

export default Home;
