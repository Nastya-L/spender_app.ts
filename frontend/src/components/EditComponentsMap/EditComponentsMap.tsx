import React from 'react';
import { SettingsSectionId } from '../../types/SettingsSectionId';
import EmailEdit from '../EditEmail/EditEmail';
import EditPassword from '../EditPassword/EditPassword';
import EditPersonalData from '../EditPersonalData/EditPersonalData';
import { EditComponentType } from './types/EditComponentProps';

const EditComponentsMap: Record<SettingsSectionId, React.FC<EditComponentType>> = {
	'Personal Data': EditPersonalData,
	Email: EmailEdit,
	Password: EditPassword,
};

export default EditComponentsMap;
