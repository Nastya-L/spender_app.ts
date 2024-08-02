import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import ModalReducer from './ModalReducer';

const RootReducer = combineReducers({
	AuthReducer,
	ModalReducer,
});

export default RootReducer;
