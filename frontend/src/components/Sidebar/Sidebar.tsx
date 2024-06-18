import React from 'react';
import { NavLink } from 'react-router-dom';
import img from '../../images/icon/filter.png';

const Sidebar: React.FC = () => {
	// TODO: Prevents it from becoming an inline function
	console.log();

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
						<div className="sidebar__jars-container">
							<div className="sidebar__jars-jar">
								<img alt="jar" src={img} />
								<p className="sidebar__jars-name">Foo Jar</p>
							</div>
							<button className="sidebar__jars-add">
								Add new Jar
							</button>
						</div>
						<div className="filters">
							<h3 className="filters__title">Filters</h3>
						</div>
					</div>
					<div className="sidebar__menu">
						<NavLink className="sidebar__menu-settings" to="/">
							Settings
						</NavLink>
						<NavLink className="sidebar__menu-sign-out" to="/user/login">
							Sign Out
						</NavLink>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
