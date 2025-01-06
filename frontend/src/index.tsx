import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import App from './App';
import store from './store';
import WidthWindowProvider from './context/WidthWindowsContext';

const root = createRoot(document.getElementById('root'));

root.render(
	<Provider store={store}>
		<WidthWindowProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</WidthWindowProvider>
	</Provider>
);
