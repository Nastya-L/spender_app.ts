import React from 'react';
import PreloaderItem from '../PreloaderItem/PreloaderItem';

const JarStatisticsPreloader: React.FC = () => (
	<div className="jars-statistics-preloader">
		<PreloaderItem size="medium" />
		<PreloaderItem size="large" />
		<PreloaderItem size="large" />
	</div>
);

export default JarStatisticsPreloader;
