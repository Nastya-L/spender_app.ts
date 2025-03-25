import React from 'react';

interface InputModalProps {
	placeholder: string;
	type: string;
	onChange: (e: React.FormEvent<HTMLInputElement>) => void;
	error: string;
	ref?: React.MutableRefObject<HTMLInputElement>;
	value: string | number | undefined;
	disabled?: boolean;
}

const InputModal: React.FC<InputModalProps> = ({
	placeholder, type, onChange, error, ref, value, disabled
}) => (
	<input
		ref={ref}
		required
		autoFocus
		placeholder={placeholder}
		type={type}
		onChange={onChange}
		className={
			error
				? 'input-modal input-modal_error'
				: 'input-modal'
		}
		value={value}
		disabled={disabled}
	/>
);

InputModal.defaultProps = {
	ref: null,
	disabled: false
};

export default InputModal;
