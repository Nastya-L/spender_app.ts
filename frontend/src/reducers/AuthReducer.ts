import { createSlice } from '@reduxjs/toolkit';
import { IInternalAuthState } from '../interfaces/AuthState';

const initialState: IInternalAuthState = {
	user: null,
	isAuthenticated: false
};

/* eslint-disable no-param-reassign, @typescript-eslint/no-unsafe-assignment */
const AuthReducer = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		loginSuccess: (state, action) => {
			state.user = action.payload;
			state.isAuthenticated = true;
		},
		logout: (state) => {
			state.user = null;
			state.isAuthenticated = false;
		},
	},
});
export const { loginSuccess, logout } = AuthReducer.actions;
export default AuthReducer.reducer;
