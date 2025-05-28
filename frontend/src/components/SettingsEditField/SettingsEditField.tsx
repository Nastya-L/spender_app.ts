import React from 'react';

interface SettingsEditFieldProps {
	label: string;
	children: React.ReactNode;
}

const SettingsEditField: React.FC<SettingsEditFieldProps> = ({ label, children }) => (
	<div className="settings-data-edit__container">
		<p className="settings-data-edit__header">{label}</p>
		{children}
	</div>
);

export default SettingsEditField;
