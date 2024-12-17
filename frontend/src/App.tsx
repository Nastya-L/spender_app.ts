import React from 'react';
import './main.scss';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import RoutesApp from './components/Routes/RoutesApp';

if (process.env.NODE_ENV === 'production') {
	disableReactDevTools();
}

const App = () => (
	<RoutesApp />
);

export default App;
