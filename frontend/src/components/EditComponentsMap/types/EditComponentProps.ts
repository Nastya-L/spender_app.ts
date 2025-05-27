import { Dispatch, SetStateAction } from 'react';
import { SettingsSectionId } from '../../../types/SettingsSectionId';

export interface EditComponentType {
  onCancel: () => void;
  setEditingSection: Dispatch<SetStateAction<SettingsSectionId>>;
}
