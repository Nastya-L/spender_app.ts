import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { SvgIconArrow, SvgIconLogOut } from '../UI/SvgIcon/SvgIcon';
import { logout } from '../../reducers/AuthReducer';

const SidebarSettings: React.FC = () => {
	const dispatch = useDispatch();
	return (
		<div className="settings__sidebar">
			<div className="settings__sidebar__wrapper">
				<Link to="/home" className="settings__back">
					<SvgIconArrow />
					<p className="settings__back__text">Back to Jars</p>
				</Link>
				<div className="settings__sidebar__item">
					<Link
						onClick={() => { dispatch(logout()); }}
						className="sidebar__menu__item"
						to="/user/login"
					>
						<SvgIconLogOut />
						Sign Out
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SidebarSettings;
