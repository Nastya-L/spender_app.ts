import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import authClient, { IAuthClientError } from '../../services/authClient';
import { ErrorResponse } from '../../types/Error';
import { deleteJar } from '../../reducers/JarsReducer';
import { closeModal } from '../../reducers/ModalReducer';
import { RootState } from '../../store';
import { ActionRemoveButton, ActionSubmitButton } from '../UI/ActionButton/ActionButton';

const DeleteJarModal: React.FC = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const jars = useSelector((state: RootState) => state.jars.jars);
	const jarsRef = useRef(jars);
	const [isLoading, setIsLoading] = useState<boolean>(false);

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
		setIsLoading(true);
		authClient.delete<string>(`/jar/${id}`)
			.then(() => {
				dispatch(deleteJar(id));
				toast.success('The Jar has been successfully deleted');
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
				setIsLoading(false);
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
				<ActionRemoveButton
					text="OK"
					isLoading={isLoading}
					onClick={DeleteJar}
				/>
				<ActionSubmitButton
					text="Cancel"
					isLoading={false}
					onClick={Cancel}
				/>
			</div>
		</div>
	);
};

export default DeleteJarModal;
