import { useContext } from 'react';
import { widthWindowContext } from '../context/WidthWindowsContext';

const useWidthWindow = () => {
	const context = useContext(widthWindowContext);

	if (!context) {
		throw new Error(
			'useWidthWindow hook can be used only inside the widthWindowContext'
		);
	}

	return context;
};

export default useWidthWindow;
