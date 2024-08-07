import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import authClient, { IAuthClientError } from '../../services/authClient';
import { ErrorResponse } from '../../types/Error';
import imgDelete from '../../images/icon/delete.png';
import { deleteJar } from '../../reducers/JarsReducer';
import { closeModal } from '../../reducers/ModalReducer';
import { RootState } from '../../store';

const DeleteJarModal: React.FC = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const jars = useSelector((state: RootState) => state.jars.jars);
	const jarsRef = useRef(jars);

	useEffect(() => {
		if (jarsRef.current.length !== jars.length) {
			jarsRef.current = jars;
			dispatch(closeModal());
			if (jars.length === 0) {
				navigate('/home');
			} else {
				navigate(`/home/jar/${jars[0]._id}`);
			}
		}
	}, [jars]);

	const DeleteJar = () => {
		authClient.delete<string>(`/jar/${id}`)
			.then(() => {
				dispatch(deleteJar(id));
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
	};

	const Cancel = () => {
		dispatch(closeModal());
	};

	return (
		<div className="delete-jar">
			<h3 className="delete-jar__title">Delete Jar</h3>
			<p className="delete-jar__descr">
				Are you sure you want to delete the Jar?
			</p>
			<div className="delete-jar__confirm">
				<button onClick={DeleteJar} className="delete-jar__confirm__delete">
					<img src={imgDelete} alt="DeleteJar" />
					{' '}
					OK
				</button>
				<button onClick={Cancel} className="delete-jar__confirm__cancel">Cancel</button>
			</div>
		</div>
	);
};

export default DeleteJarModal;
