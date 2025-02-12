import React from 'react';

export type PreloaderItemType = 'small' | 'medium' | 'large';

interface PreloaderItemProps {
	size: PreloaderItemType;
}

const PreloaderItem: React.FC<PreloaderItemProps> = ({ size }) => (
	<div className={`preloader-item preloader-item_${size}`} />
);

export default PreloaderItem;
