import React from 'react';

interface ICategoryProps {
	colorItem: string,
	ChooseColor: (color: string) => void,
	isChecked: boolean,
}

const ColorOption: React.FC<ICategoryProps> = ({ colorItem, ChooseColor, isChecked }) => {
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		ChooseColor(e.target.value);
	};

	return (
		<>
			<input
				checked={isChecked}
				onChange={onChange}
				type="radio"
				id={`color-option-${colorItem}`}
				name="category"
				value={colorItem}
				className="color__input"
			/>
			<label
				className="color__label"
				htmlFor={`color-option-${colorItem}`}
				style={{ backgroundColor: `#${colorItem}` }}
			>
				{}
			</label>
		</>
	);
};

export default ColorOption;
