interface User {
	firstName: string;
	lastName: string,
	email: string,
	password: string,
	repeatPassword: string,
	[key: string]: string
}

const isValidFirstLastNames = (value: string): string | undefined => {
	if (value.length === 0) {
		return 'Enter First and Last Name';
	}
	return undefined;
};

const isValidPassword = (password: string, repeatPassword: string): string | undefined => {
	const minLengthPassword:number = 6;
	const lettersConsist: boolean = /[a-zA-Z]/.test(password);
	const digitsConsist: boolean = /[0-9]/.test(password);

	if (repeatPassword && repeatPassword !== password) {
		return 'Password mismatch';
	}
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

const isValidEmail = (email: string): string | undefined => {
	if (!/\S+@\S+\.\S+/.test(email)) {
		return 'Enter your email';
	}
	return undefined;
};

const ValidateUserField = (name: string, value: string, user: User):string | undefined => {
	switch (name) {
	case 'firstName':
		return isValidFirstLastNames(value);
	case 'lastName':
		return isValidFirstLastNames(value);
	case 'email':
		return isValidEmail(value);
	case 'password':
		return isValidPassword(value, user.repeatPassword);
	case 'repeatPassword':
		return isValidPassword(user.password, value);
	default:
		return undefined;
	}
};

const ValidateUser = (user: User): string | undefined => {
	let error: string;
	Object.keys(user).every((key: string) => {
		error = ValidateUserField(key, user[key], user);
		return error === undefined;
	});
	return error;
};

export {
	User, ValidateUserField, ValidateUser, isValidPassword, isValidEmail
};
