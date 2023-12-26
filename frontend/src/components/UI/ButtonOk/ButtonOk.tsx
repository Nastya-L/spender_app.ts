import React from 'react';

type ButtonProps = {
    text: string,
    action: () => void
}

const ButtonOk: React.FC<ButtonProps> = ({ text, action }): React.JSX.Element => (
	<button className="button-ok" onClick={action}>
		{text}
	</button>
);

export default ButtonOk;
