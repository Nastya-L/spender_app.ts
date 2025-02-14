import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ColorOption from '../UI/ColorOption/ColorOption';
import { IJar } from '../../interfaces/Jar';
import authClient from '../../services/authClient';
import { ErrorResponse } from '../../types/Error';
import { closeModal } from '../../reducers/ModalReducer';
import { addJar } from '../../reducers/JarsReducer';
import ErrorMessage from '../UI/ErrorMessage/ErrorMessage';
import useErrorManager from '../../hooks/useErrorManager';
import { ActionSubmitButton } from '../UI/ActionButton/ActionButton';

export const defaultColors = ['FFE074', 'FF9C64', 'FA7878', 'F881DE', 'B28FFE', '5E90F2', '07A4B9', '5BE8B1', '42AE31', 'B23B98'];

const CreateJarModal: React.FC = () => {
	const [colorValue, setColorValue] = useState(defaultColors[2]);
	const [nameJar, setNameJar] = useState('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const {
		setErrors, getErrors, clearErrors
	} = useErrorManager();

	const ChooseColor = (color: string) => {
		setColorValue(color);
	};

	const ChangeNameJar = (e: React.FormEvent<HTMLInputElement>) => {
		setNameJar(e.currentTarget.value);
	};

	const ClickCreateJar = () => {
		const newJar = {
			name: nameJar,
			color: colorValue
		};
		setIsLoading(true);
		authClient.post<IJar>('/jar', newJar)
			.then((response) => {
				const responseData = response.data;
				dispatch(closeModal());
				dispatch(addJar(responseData));
				navigate(`/home/jar/${responseData._id}`);
				clearErrors();
			}).catch((error) => {
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
		<div className="create-jar">
			<h3 className="create-jar__title">Create Jar</h3>
			<p className="create-jar__descr">
				Enter the short name of new jar to easy find it in a list of your jars.
				You can rename it at any time later
			</p>
			<form id="create-jar" className="create-jar__form">
				<input
					className={
						getErrors('name')
							? 'create-jar__form__input create-jar__form__input_error'
							: 'create-jar__form__input'
					}
					placeholder="Jar name"
					required
					type="text"
					onChange={ChangeNameJar}
				/>
				<ErrorMessage text={getErrors('name')} />
			</form>
			<div className="create-jar__color">
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
				text="Create"
				isLoading={isLoading}
				onClick={ClickCreateJar}
			/>
		</div>
	);
};

export default CreateJarModal;
