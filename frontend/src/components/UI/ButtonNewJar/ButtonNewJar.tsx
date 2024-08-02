import React from 'react';
import { useDispatch } from 'react-redux';
import { openModal } from '../../../reducers/ModalReducer';

type ButtonProps = {
    nameClass: string
}

const ButtonNewJar:React.FC<ButtonProps> = ({ nameClass }) => {
	const dispatch = useDispatch();

	const openCreateJar = () => {
		dispatch(openModal('createJar'));
	};

	return (
		<button className={nameClass} onClick={openCreateJar}>
			Add new Jar
		</button>
	);
};

export default ButtonNewJar;
