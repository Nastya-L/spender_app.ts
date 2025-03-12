import React, { ReactNode } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from '../../UI/Spinner/Spinner';
import breakpoints from '../../../constants/breakpoints';
import useWidthWindow from '../../../hooks/useWidthWindows';

interface InfiniteScrollWrapperProps {
	dataLength: number;
	hasMore: boolean;
	setCurrentPage: (value: React.SetStateAction<number>) => void;
	children: ReactNode;
}

const InfiniteScrollWrapper: React.FC<InfiniteScrollWrapperProps> = ({
	dataLength, hasMore, setCurrentPage, children
}) => {
	const { windowWidth } = useWidthWindow();
	const isMobile = windowWidth <= breakpoints.tablet;

	const nextPage = () => {
		setCurrentPage((prev) => prev + 1);
	};

	return (
		<InfiniteScroll
			dataLength={dataLength}
			next={nextPage}
			hasMore={hasMore}
			loader={(
				<div className="infinite-scroll">
					<Spinner />
				</div>
			)}
			scrollableTarget={!isMobile && 'scrollableDiv'}
			style={{ overflow: 'hidden' }}
		>
			{children}
		</InfiniteScroll>
	);
};

export default InfiniteScrollWrapper;
