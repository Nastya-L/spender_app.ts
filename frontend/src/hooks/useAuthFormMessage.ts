import { useMemo, useState } from 'react';
import AuthFormMessageType from '../types/AuthFormMessageType';

export interface IMessage {
	text: string;
	style: AuthFormMessageType;
}

const useAuthFormMessage = () => {
	const [messageText, setMessageText] = useState<string>('');
	const [style, setStyle] = useState<AuthFormMessageType>(AuthFormMessageType.error);

	const displayMessage = (text: string, type: AuthFormMessageType) => {
		setMessageText(text);
		setStyle(type);
	};

	const message = useMemo(() => ({ text: messageText, style }), [messageText, style]);

	return { message, displayMessage };
};

export default useAuthFormMessage;
