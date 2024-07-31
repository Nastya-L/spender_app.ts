import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from './reducers/AuthReducer';
import authMiddleware from './Middleware/authMiddleware';
import { IUser } from './interfaces/User';

const getUserSave = (): IUser => {
	try {
		const user = JSON.parse(localStorage.getItem('user')) as IUser;
		return user;
	} catch {
		return null;
	}
};
const isAuthenticated = Boolean(getUserSave());

const preloadedState = {
	auth: {
		user: getUserSave(),
		isAuthenticated
	},
};

const store = configureStore({
	reducer: {
		auth: AuthReducer,
	},
	preloadedState,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
