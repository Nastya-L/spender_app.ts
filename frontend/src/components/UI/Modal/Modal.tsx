import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IModalState } from '../../../interfaces/Modal';
import arrow from '../../../images/icon/arrow-right.png';
import CreateJarModal from '../../CreateJarModal/CreateJarModal';
import { closeModal } from '../../../reducers/ModalReducer';
import DeleteJarModal from '../../DeleteJarModal/DeleteJarModal';
import EditJarModal from '../../EditJarModal/EditJarModal';
import ShareJarModal from '../../ShareJarModal/ShareJarModal';

interface IModalContent {
	[componentName: string]: React.ComponentType
}

const modalContentTable: IModalContent = {
	createJar: CreateJarModal,
	deleteJar: DeleteJarModal,
	editJar: EditJarModal,
	shareJar: ShareJarModal
};

const Modal: React.FC = () => {
	const dispatch = useDispatch();
	const componentName = useSelector((state: IModalState) => state.modal.contentName);
	const Component = modalContentTable[componentName];

	if (!Component) {
		return null;
	}

	const CloseModal = () => {
		dispatch(closeModal());
	};

	return (
		<div className="modal">
			<div className="modal__container">
				<button className="modal__close" onClick={CloseModal}>
					<img src={arrow} alt="arrowClose" />
				</button>
				<Component />
			</div>
		</div>
	);
};

export default Modal;
