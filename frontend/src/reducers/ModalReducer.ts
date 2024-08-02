import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IInitialModal } from '../interfaces/Modal';

const initialState: IInitialModal = {
	contentName: null
};

const ModalReducer = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		openModal: (state, action: PayloadAction<string>) => {
			state.contentName = action.payload;
		},
		closeModal: (state) => {
			state.contentName = null;
		},
	},
});

export const { openModal, closeModal } = ModalReducer.actions;
export default ModalReducer.reducer;
