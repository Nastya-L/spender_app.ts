import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ErrorResponse } from '../../types/Error';
import Sidebar from '../../components/Sidebar/Sidebar';
import HistoryJar from '../../components/HistoryJar/HistoryJar';
import { IAuthState } from '../../interfaces/AuthState';
import { IJar } from '../../interfaces/Jar';
import authClient, { IAuthClientError } from '../../services/authClient';
import NoJar from '../../components/NoJar/NoJar';
import Modal from '../../components/UI/Modal/Modal';
import { setJars } from '../../reducers/JarsReducer';
import { RootState } from '../../store';
import breakpoints from '../../constants/breakpoints';
import useWidthWindow from '../../hooks/useWidthWindows';
import MobileMenuButton from '../../components/UI/MobileMenuButton/MobileMenuButton';
import { SvgIconCross } from '../../components/UI/SvgIcon/SvgIcon';
import HistoryJarPreloader from '../../components/UI/HistoryJarPreloader/HistoryJarPreloader';

const Home: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { id } = useParams();
	const authState = useSelector((state: IAuthState) => state.auth.isAuthenticated);
	const jars = useSelector((state: RootState) => state.jars.jars);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isPreloader, setIsPreloader] = useState<boolean>(true);

	const { windowWidth } = useWidthWindow();
	const isMobile = windowWidth <= breakpoints.tablet;

	useEffect(() => {
		if (!authState) {
			navigate('/');
			return;
		}
		setIsPreloader(true);
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
			}).finally(() => {
				setIsPreloader(false);
			});
	}, []);

	useEffect(() => {
		if (jars.length > 0) {
			if (!id) {
				navigate(`/home/jar/${jars[0]._id}`);
			}
		}
	}, [jars]);

	useEffect(() => {
		const body = document.getElementById('body');
		if (isOpen) {
			body.style.overflow = 'hidden';
		} else {
			body.style.overflow = 'visible';
		}
	}, [isOpen]);

	const jarPlaceholder = (jars.length > 0) ? <HistoryJar /> : <NoJar />;

	return (
		<main className="home">
			{!isMobile && <Sidebar isPreloader={isPreloader} jars={jars} setIsOpen={setIsOpen} />}
			{(isOpen && isMobile) && (
				<div className={isOpen && 'home__sidebar'}>
					<Sidebar isPreloader={isPreloader} jars={jars} setIsOpen={setIsOpen} />
					<button aria-label="close" className="home__sidebar__close" onClick={() => setIsOpen(false)}>
						<SvgIconCross />
					</button>
				</div>
			)}

			<div className="home__main">
				{isMobile && <MobileMenuButton setIsOpen={setIsOpen} />}
				{isPreloader
					? <HistoryJarPreloader />
					: jarPlaceholder }
				<Modal />
			</div>
		</main>
	);
};

export default Home;
