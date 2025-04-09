import React from 'react';

interface CheckboxLinearProps {
	id: string;
	onChange: () => void;
	checked: boolean;
	text?: string;
}

const CheckboxLinear: React.FC<CheckboxLinearProps> = ({
	id, onChange, checked, text
}) => (
	<div className="checkbox-linear">
		<label htmlFor={id} className="checkbox-linear__label">
			<input
				className="checkbox-linear__input"
				id={id}
				type="checkbox"
				checked={checked}
				onChange={onChange}
			/>
			{text}
		</label>
	</div>
);

CheckboxLinear.defaultProps = {
	text: ''
};

export default CheckboxLinear;
