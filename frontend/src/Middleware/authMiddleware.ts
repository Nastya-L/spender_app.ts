import { Middleware } from 'redux';
import { loginSuccess, logout } from '../reducers/AuthReducer';

const authMiddleware: Middleware = () => (next) => (action) => {
	if (loginSuccess.match(action)) {
		localStorage.setItem('user', JSON.stringify(action.payload));
	} else if (logout.match(action)) {
		localStorage.setItem('user', JSON.stringify(null));
	}

	return next(action);
};

export default authMiddleware;
