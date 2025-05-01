import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SingUp from '../pages/SingUp/SingUp';
import SingIn from '../pages/SingIn/SingIn';
import Greetings from '../components/Greetings/Greetings';
import Home from '../pages/Home/Home';
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword';
import ResetPassword from '../pages/ResetPassword/ResetPassword';

const RoutesApp = () => (
	<Routes>
		<Route path="/" element={<Greetings />} />
		<Route path="/user/register" element={<SingUp />} />
		<Route path="/user/login" element={<SingIn />} />
		<Route path="/user/forgot-password" element={<ForgotPassword />} />
		<Route path="/user/reset-password" element={<ResetPassword />} />
		<Route path="/home" element={<Home />} />
		<Route path="/home/jar" element={<Home />} />
		<Route path="/home/jar/:id" element={<Home />} />

		<Route path="*" element={<Greetings />} />
	</Routes>
);

export default RoutesApp;
