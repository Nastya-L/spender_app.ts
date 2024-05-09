import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SingUp from '../SingUp/SingUp';
import SingIn from '../SingIn/SingIn';
import Greetings from '../Greetings/Greetings';

const RoutesApp = () => (
	<Routes>
		<Route path="/" element={<Greetings />} />
		<Route path="/user/register" element={<SingUp />} />
		<Route path="/user/login" element={<SingIn />} />
	</Routes>
);

export default RoutesApp;
