const isValidEditPassword = (password: string,): string | undefined => {
	const minLengthPassword:number = 6;
	const lettersConsist: boolean = /[a-zA-Z]/.test(password);
	const digitsConsist: boolean = /[0-9]/.test(password);

	if (password.length < minLengthPassword && password.length !== 0) {
		return 'Password length must be from 6 to 10 characters';
	}
	if (password.length === 0) {
		return 'Enter your password';
	}
	if (!(lettersConsist && digitsConsist)) {
		return 'The password must contain numbers and letters';
	}
	return undefined;
};

export default isValidEditPassword;
