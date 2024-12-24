import React from 'react';

interface ErrorMessageProps {
	text: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ text }) => (
	<div className="error-message">
		<p className="error-message__text">{text}</p>
	</div>
);

export default ErrorMessage;
