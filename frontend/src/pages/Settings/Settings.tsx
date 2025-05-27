import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SettingsItemWrapper from '../../components/SettingsItemWrapper/SettingsItemWrapper';
import { SvgIconCross } from '../../components/UI/SvgIcon/SvgIcon';
import SettingsItem from '../../components/SettingsItem/SettingsItem';
import settingsData from '../../constants/settingsData';
import { SettingsSectionId } from '../../types/SettingsSectionId';
import { IAuthState } from '../../interfaces/AuthState';
import breakpoints from '../../constants/breakpoints';
import useWidthWindow from '../../hooks/useWidthWindows';
import MobileMenuButton from '../../components/UI/MobileMenuButton/MobileMenuButton';
import SidebarSettings from '../../components/SidebarSettings/SidebarSettings';
import EditComponentsMap from '../../components/EditComponentsMap/EditComponentsMap';

export interface IEditUserContent {
	[componentName: string]: React.ReactNode
}

const Settings: React.FC = () => {
	const [editingSection, setEditingSection] = useState<SettingsSectionId | null>(null);
	const authUser = useSelector((state: IAuthState) => state.auth.user);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const { windowWidth } = useWidthWindow();
	const isMobile = windowWidth <= breakpoints.tablet;

	const handleEditClick = (id: SettingsSectionId) => {
		setEditingSection(id);
	};

	const closeEditComponent = () => {
		setEditingSection(null);
	};

	const renderEditComponent = (id: SettingsSectionId) => {
		const EditComponent = EditComponentsMap[id];
		return EditComponent ? (
			<EditComponent
				onCancel={closeEditComponent}
				setEditingSection={setEditingSection}
			/>
		) : null;
	};

	return (
		<section className="home settings">
			{!isMobile && <SidebarSettings />}
			{(isOpen && isMobile) && (
				<div className={isOpen && 'home__sidebar'}>
					<SidebarSettings />
					<button aria-label="close" className="home__sidebar__close" onClick={() => setIsOpen(false)}>
						<SvgIconCross />
					</button>
				</div>
			)}
			<div className="home__main settings__main">
				{isMobile && <MobileMenuButton setIsOpen={setIsOpen} />}
				<div className="settings__wrapper">
					<h2 className="settings__title">Settings</h2>
					<div className="settings__container">
						{settingsData.map((section) => {
							const wrapper = section.getWrapper(authUser);
							const items = section.getItems(authUser);
							return (
								<SettingsItemWrapper
									key={section.id}
									title={section.id}
									desc={wrapper}
								>
									{editingSection === section.id
										? renderEditComponent(section.id)
										: (
											<SettingsItem
												id={section.id}
												SettingsItemsData={items}
												onClick={handleEditClick}
											/>
										)}
								</SettingsItemWrapper>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Settings;
