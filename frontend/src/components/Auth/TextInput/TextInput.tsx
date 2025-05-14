import React from 'react';

export interface TextInputProps {
	name: string;
	placeholder: string;
	onChange: (e: React.FormEvent<HTMLInputElement>) => void;
	onBlur?: (e: React.FormEvent<HTMLInputElement>) => void;
	type?: string;
	formId: string;
	disabled?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
	name,
	placeholder,
	onChange,
	onBlur,
	type,
	formId,
	disabled
}) => (
	<input
		name={name}
		required
		form={formId}
		placeholder={placeholder}
		type={type}
		className="auth-form__input"
		onChange={onChange}
		onBlur={onBlur}
		disabled={disabled}
	/>
);

TextInput.defaultProps = {
	type: 'text',
	disabled: false,
	onBlur: () => {}
};

export default TextInput;
