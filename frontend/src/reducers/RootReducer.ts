import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import ModalReducer from './ModalReducer';
import JarsReducer from './JarsReducer';

const RootReducer = combineReducers({
	AuthReducer,
	ModalReducer,
	JarsReducer
});

export default RootReducer;
