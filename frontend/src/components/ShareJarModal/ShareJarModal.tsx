import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ErrorResponse } from '../../types/Error';
import authClient, { IAuthClientError } from '../../services/authClient';
import trash from '../../images/icon/trash.png';
import { RootState } from '../../store';
import { IJar } from '../../interfaces/Jar';
import { editJar } from '../../reducers/JarsReducer';
import ErrorMessage from '../UI/ErrorMessage/ErrorMessage';
import useErrorManager from '../../hooks/useErrorManager';

interface IUsersJar {
	_id: string
	firstName: string
}

const ShareJarModal: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [emailValue, setEmailValue] = useState('');
	const [users, setUsers] = useState<Array<IUsersJar>>([]);

	const {
		setErrors, getErrors, clearErrors
	} = useErrorManager();

	const jars = useSelector((state: RootState) => state.jars.jars);
	const editableJar = jars.find((jar) => jar._id === id);

	const getSharedUsers = (usersArray: Array<IUsersJar>) => usersArray
		.filter((user) => user._id !== editableJar.owner);

	useEffect(() => {
		setUsers(getSharedUsers(editableJar.users));
	}, []);

	const ClickDeleteUser = (userId: string) => {
		authClient.delete<IJar>(`/share/${id}/user/${userId}`)
			.then((response) => {
				const responseData = response.data;
				dispatch(editJar(responseData));
				setUsers(getSharedUsers(responseData.users));
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
	};

	const ChangeEmailFriend = (e: React.FormEvent<HTMLInputElement>) => {
		setEmailValue(e.currentTarget.value);
	};

	const ClickShareJar = () => {
		const email = {
			email: emailValue
		};
		authClient.post<IJar>(`/share/${id}`, email)
			.then((response) => {
				const responseData = response.data;
				dispatch(editJar(responseData));
				setEmailValue('');
				setUsers(getSharedUsers(responseData.users));
				clearErrors();
			}).catch((error: IAuthClientError) => {
				if (error.redirect) {
					navigate(error.redirect);
					return;
				}
				if (axios.isAxiosError<ErrorResponse, Record<string, unknown>>(error)) {
					if (error.response.data) {
						const errorResponse = error.response.data;
						setErrors(errorResponse);
					} else {
						toast.error('Something went wrong');
					}
				}
			});
	};

	return (
		<div className="share-jar">
			<h3 className="share-jar__title">Invite your friend</h3>
			<p className="share-jar__desc">
				Invite your friend to the Jar, and you will be able to manage your shared budget together.
				<br />
				Enter the email of a registered user.
			</p>
			<form id="share-jar" className="share-jar__form">
				<input
					placeholder="Email"
					required
					type="text"
					onChange={ChangeEmailFriend}
					value={emailValue}
					className={
						getErrors('email')
							? 'share-jar__form__input share-jar__form__input_error'
							: 'share-jar__form__input'
					}
				/>
				<ErrorMessage text={getErrors('email')} />
			</form>
			<p className="share-jar__users__title">Shared Users</p>
			<div className="share-jar__users">
				{users.length === 0
					? (
						<p className="share-jar__desc share-jar__desc_users">
							You haven&apos;t shared access to this jar with anyone yet.
						</p>
					)
					: (
						<div className="share-jar__users__wrap">
							{users.map((user) => (
								<div key={user._id} className="share-jar__users__item">
									<p className="share-jar__users__name">{user.firstName}</p>
									<button onClick={() => { ClickDeleteUser(user._id); }} className="edit-jar__users__delete">
										<img src={trash} alt="trash" />
									</button>
								</div>
							))}
						</div>
					)}
			</div>
			<button onClick={ClickShareJar} className="share-jar__btn">Invite</button>
		</div>
	);
};

export default ShareJarModal;
