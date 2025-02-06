import React, { Dispatch, SetStateAction } from 'react';
import { NavLink } from 'react-router-dom';
import { IJar } from '../../interfaces/Jar';
import ButtonNewJar from '../UI/ButtonNewJar/ButtonNewJar';
import { SvgIconLogOut, SvgIconSettings } from '../UI/SvgIcon/SvgIcon';
import SidebarPreloader from '../UI/SidebarPreloader/SidebarPreloader';

interface SidebarProps {
	isPreloader: boolean;
	jars: IJar[];
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isPreloader, jars, setIsOpen }) => {
	const onChange = () => {
		setIsOpen(false);
	};

	return (
		<div className="sidebar">
			<div className="sidebar__container">
				<h2 className="sidebar__container-title">
					Menu
				</h2>
				<div className="sidebar__wrap">
					<div className="sidebar__jars">
						<h3 className="sidebar__jars-title">
							Jars
						</h3>
						{isPreloader
							? <SidebarPreloader />
							: (
								<div className="sidebar__jars-container">
									{jars.map((jar) => (
										<NavLink
											key={jar._id}
											to={`/home/jar/${jar._id}`}
											id={jar._id}
											onClick={onChange}
											className={({ isActive }) => (isActive ? 'is-active' : 'sidebar__jars-jar')}
										>
											<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 30 30" style={{ fill: `#${jar.color}`, stroke: jar.color }}>
												<circle cx="14" cy="14" r="12" />
											</svg>
											<p className="sidebar__jars-name">{jar.name}</p>
										</NavLink>
									))}
									<ButtonNewJar nameClass="sidebar__jars-add" />
								</div>
							)}
						<div className="filters">
							<h3 className="filters__title">Filters</h3>
						</div>
					</div>
					<div className="sidebar__menu">
						<NavLink className="sidebar__menu__item" to="/">
							<SvgIconSettings />
							Settings
						</NavLink>
						<NavLink className="sidebar__menu__item" to="/user/login">
							<SvgIconLogOut />
							Sign Out
						</NavLink>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
