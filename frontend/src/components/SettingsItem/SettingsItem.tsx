import React from 'react';
import { SettingsSectionId } from '../../types/SettingsSectionId';
import { settingsDataItems } from '../../interfaces/settingsDataType';

interface SettingsItemProps {
	id: SettingsSectionId;
	SettingsItemsData: settingsDataItems[];
	onClick: (id: SettingsSectionId) => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ id, SettingsItemsData, onClick }) => {
	console.log();

	return (
		<div className="settings-item" id={id}>
			<div className="settings-item__wrapper">
				{SettingsItemsData.map((item) => (
					<div key={item.text} className="settings-item__container">
						<p className="settings-item__header">{item.header}</p>
						<p className="settings-item__text">{item.text}</p>
					</div>
				))}
			</div>
			<button id={id} onClick={() => onClick(id)} className="settings-item__button">Edit</button>
		</div>
	);
};

export default SettingsItem;
