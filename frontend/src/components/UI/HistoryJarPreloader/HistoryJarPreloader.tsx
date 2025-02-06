import React from 'react';
import PreloaderItem from '../PreloaderItem/PreloaderItem';

const HistoryJarPreloader: React.FC = () => (
	<div className="history-jar-preloader">
		<PreloaderItem size="medium" />
		<PreloaderItem size="large" />
		<PreloaderItem size="large" />
		<PreloaderItem size="large" />
		<PreloaderItem size="small" />
		<PreloaderItem size="large" />
		<PreloaderItem size="large" />
		<PreloaderItem size="large" />
	</div>
);

export default HistoryJarPreloader;
