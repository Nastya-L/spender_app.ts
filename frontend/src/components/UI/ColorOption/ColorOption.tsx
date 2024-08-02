import React from 'react';

interface ICategoryProps {
	colorItem: string
}

const ColorOption: React.FC<ICategoryProps> = ({ colorItem }) => {
	console.log();

	return (
		<>
			<input type="radio" id={`color-option-${colorItem}`} name="category" value={colorItem} className="color__input" />
			<label className="color__label" htmlFor={`color-option-${colorItem}`} style={{ backgroundColor: `#${colorItem}` }}>
				{}
			</label>
		</>
	);
};

export default ColorOption;
