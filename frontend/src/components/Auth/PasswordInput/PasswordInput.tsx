import React, { useState } from 'react';
import { SvgIconEyeOff, SvgIconEyeShow } from '../../UI/SvgIcon/SvgIcon';
import { TextInputProps } from '../TextInput/TextInput';

interface PasswordInputProps extends TextInputProps {}

const PasswordInput: React.FC<PasswordInputProps> = ({
	name,
	placeholder,
	onChange,
	onBlur,
	formId,
}) => {
	const [passVisible, setPassVisible] = useState(false);

	return (
		<label className="auth-form__label" htmlFor={formId}>
			<input
				required
				autoComplete="new-password"
				name={name}
				onChange={onChange}
				onBlur={onBlur}
				minLength={6}
				maxLength={10}
				form={formId}
				placeholder={placeholder}
				type={passVisible ? 'text' : 'password'}
				className="auth-form__input password"
			/>
			<button
				type="button"
				className="auth-form__img"
				aria-label="ShowPassword"
				onClick={() => setPassVisible(!passVisible)}
			>
				{passVisible ? <SvgIconEyeShow /> : <SvgIconEyeOff />}
			</button>
		</label>
	);
};

export default PasswordInput;
