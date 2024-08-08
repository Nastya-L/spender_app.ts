import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ColorOption from '../UI/ColorOption/ColorOption';
import { defaultColors } from '../CreateJarModal/CreateJarModal';
import authClient, { IAuthClientError } from '../../services/authClient';
import { IJar } from '../../interfaces/Jar';
import { ErrorResponse } from '../../types/Error';
import { editJar } from '../../reducers/JarsReducer';
import { closeModal } from '../../reducers/ModalReducer';
import { RootState } from '../../store';

const EditJarModal: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const jars = useSelector((state: RootState) => state.jars.jars);
	const editableJar = jars.find((jar) => jar._id === id);

	const [colorValue, setColorValue] = useState(editableJar.color);
	const [jarName, setJarName] = useState(editableJar.name);

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
		authClient.put<IJar>(`/jar/${id}`, updatedJar)
			.then((response) => {
				const responseData = response.data;
				dispatch(editJar(responseData));
				dispatch(closeModal());
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

	return (
		<div className="edit-jar">
			<h3 className="edit-jar__title">
				Edit Jar
			</h3>
			<p className="edit-jar__descr">
				You can edit the Jar by specifying a new name and color
			</p>
			<form id="edit-jar" className="edit-jar__form">
				<input
					className="edit-jar__form__input"
					placeholder="Jar name"
					required
					type="text"
					onChange={ChangeNameJar}
					value={jarName}
				/>
			</form>
			<div className="edit-jar__color">
				{defaultColors.map((color) => (
					<ColorOption
						key={color}
						colorItem={color}
						ChooseColor={ChooseColor}
					/>
				))}
			</div>
			<button onClick={ClickEditJar} className="edit-jar__btn">Edit</button>
		</div>
	);
};

export default EditJarModal;
