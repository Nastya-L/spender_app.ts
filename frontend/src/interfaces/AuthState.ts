import { IUser } from './User';

export interface IInternalAuthState {
	user: IUser,
	isAuthenticated: boolean
}

export interface IAuthState {
	auth: IInternalAuthState
}
