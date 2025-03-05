import classNames from 'classnames';
import React, { ReactNode } from 'react';

interface JarOptionsProps {
	jarOptionsIsOpen: boolean;
	children: ReactNode;
}

const JarOptions: React.FC<JarOptionsProps> = ({ jarOptionsIsOpen, children }) => (
	<div className={classNames((jarOptionsIsOpen === true ? 'history-jar__head__menu__open' : 'none'))}>
		<div className="history-jar__head__menu__items">
			{children}
		</div>
	</div>
);

export default JarOptions;
