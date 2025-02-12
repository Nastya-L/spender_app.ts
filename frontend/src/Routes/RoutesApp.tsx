import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SingUp from '../components/SingUp/SingUp';
import SingIn from '../components/SingIn/SingIn';
import Greetings from '../components/Greetings/Greetings';
import Home from '../components/Home/Home';

const RoutesApp = () => (
	<Routes>
		<Route path="/" element={<Greetings />} />
		<Route path="/user/register" element={<SingUp />} />
		<Route path="/user/login" element={<SingIn />} />
		<Route path="/home" element={<Home />} />
		<Route path="/home/jar" element={<Home />} />
		<Route path="/home/jar/:id" element={<Home />} />

		<Route path="*" element={<Greetings />} />
	</Routes>
);

export default RoutesApp;
