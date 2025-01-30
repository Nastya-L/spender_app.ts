import React, {
	createContext, useEffect, useState, useCallback
} from 'react';
import { widthWindowContextType, widthWindowProviderPropsType } from '../types/widthWindowContextType';

export const widthWindowContext = createContext<widthWindowContextType>({
	windowWidth: window.innerWidth,
});

const WidthWindowProvider: React.FC<widthWindowProviderPropsType> = ({ children }) => {
	const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
	const handleResize = useCallback(() => {
		setWindowWidth(window.innerWidth);
	}, []);

	useEffect(() => {
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [handleResize]);

	const widthWindowState: widthWindowContextType = { windowWidth };

	return (
		<widthWindowContext.Provider value={widthWindowState}>
			{children}
		</widthWindowContext.Provider>
	);
};

export default WidthWindowProvider;
