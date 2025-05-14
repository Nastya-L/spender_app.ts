import { SettingsSectionId } from '../types/SettingsSectionId';
import { IUser } from './User';

export interface settingsDataItems {
	header: string;
	text: string;
}

export interface settingsDataType {
	id: SettingsSectionId;
	getWrapper: (user: IUser) => string;
	getItems: (user: IUser) => settingsDataItems[];
}
