import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ColorOption from '../UI/ColorOption/ColorOption';
import { defaultColors } from '../CreateJarModal/CreateJarModal';
import authClient, { IAuthClientError } from '../../services/authClient';
import { IJar } from '../../interfaces/Jar';
import { ErrorResponse } from '../../types/Error';
import { editJar } from '../../reducers/JarsReducer';
import { closeModal } from '../../reducers/ModalReducer';
import { RootState } from '../../store';
import ErrorMessage from '../UI/ErrorMessage/ErrorMessage';
import useErrorManager from '../../hooks/useErrorManager';
import { ActionSubmitButton } from '../UI/ActionButton/ActionButton';
import InputModal from '../UI/InputModal/InputModal';

const EditJarModal: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const jars = useSelector((state: RootState) => state.jars.jars);
	const editableJar = jars.find((jar) => jar._id === id);

	const [colorValue, setColorValue] = useState(editableJar.color);
	const [jarName, setJarName] = useState(editableJar.name);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const {
		setErrors, getErrors, clearErrors
	} = useErrorManager();

	const ChooseColor = (color: string) => {
		setColorValue(color);
	};

	const ChangeNameJar = (e: React.FormEvent<HTMLInputElement>) => {
		setJarName(e.currentTarget.value);
	};

	const ClickEditJar = () => {
		const updatedJar = {
			name: jarName,
			color: colorValue
		};
		setIsLoading(true);
		authClient.put<IJar>(`/jar/${id}`, updatedJar)
			.then((response) => {
				const responseData = response.data;
				dispatch(editJar(responseData));
				dispatch(closeModal());
				clearErrors();
			}).catch((error: IAuthClientError) => {
				if (error.redirect) {
					navigate(error.redirect);
					return;
				}
				if (axios.isAxiosError<ErrorResponse, Record<string, unknown>>(error)) {
					if (error.response) {
						const errorResponse = error.response.data;
						setErrors(errorResponse);
					} else {
						toast.error('Something went wrong');
					}
				}
			}).finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<div className="edit-jar">
			<h3 className="edit-jar__title">
				Edit Jar
			</h3>
			<p className="edit-jar__descr">
				You can edit the Jar by specifying a new name and color
			</p>
			<form id="edit-jar" className="edit-jar__form">
				<InputModal
					placeholder="Jar name"
					type="text"
					onChange={ChangeNameJar}
					error={getErrors('name')}
					value={jarName}
				/>
				<ErrorMessage text={getErrors('name')} />
			</form>
			<div className="edit-jar__color">
				{defaultColors.map((color) => (
					<ColorOption
						key={color}
						colorItem={color}
						ChooseColor={ChooseColor}
						isChecked={color === colorValue}
					/>
				))}
			</div>
			<ActionSubmitButton
				text="Edit"
				isLoading={isLoading}
				onClick={ClickEditJar}
			/>
		</div>
	);
};

export default EditJarModal;
