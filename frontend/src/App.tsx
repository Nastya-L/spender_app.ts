import React from 'react';
import { Bounce, ToastContainer } from 'react-toastify';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import RoutesApp from './components/Routes/RoutesApp';
import 'react-toastify/dist/ReactToastify.css';
import './main.scss';

if (process.env.NODE_ENV === 'production') {
	disableReactDevTools();
}

const App: React.FC = () => (
	<>
		<RoutesApp />
		<ToastContainer
			position="top-left"
			autoClose={5000}
			newestOnTop={false}
			closeOnClick
			rtl={false}
			pauseOnFocusLoss
			draggable
			theme="light"
			transition={Bounce}
		/>
	</>
);

export default App;
