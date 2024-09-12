import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorResponse } from '../../types/Error';
import authClient, { IAuthClientError } from '../../services/authClient';
import { closeModal } from '../../reducers/ModalReducer';

const ShareJarModal: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [emailValue, setEmailValue] = useState('');

	const ChangeEmailFriend = (e: React.FormEvent<HTMLInputElement>) => {
		setEmailValue(e.currentTarget.value);
	};

	const ClickShareJar = () => {
		const email = {
			email: emailValue
		};
		authClient.post<string>(`/share/${id}`, email)
			.then((response) => {
				const responseData = response.data;
				console.log(responseData);
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
		<div className="share-jar">
			<h3 className="share-jar__title">Invite your friend</h3>
			<p className="share-jar__descr">
				Invite your friend to the Jar, and you will be able to manage your shared budget together.
				<br />
				Enter the email of a registered user.
			</p>
			<form id="share-jar" className="share-jar__form">
				<input
					className="share-jar__form__input"
					placeholder="Email"
					required
					type="text"
					onChange={ChangeEmailFriend}
				/>
			</form>
			<button onClick={ClickShareJar} className="create-jar__btn">Invite</button>
		</div>
	);
};

export default ShareJarModal;
