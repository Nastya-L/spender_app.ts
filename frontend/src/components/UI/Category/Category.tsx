import React from 'react';

interface ICategoryProps {
	name: string,
	path: string
}

const Category: React.FC<ICategoryProps> = ({ path, name }) => {
	console.log();

	return (
		<>
			<input type="radio" id={`category-${name}`} name="category" value={name} className="category__input" />
			<label className="category__label" htmlFor={`category-${name}`}>
				<img src={path} alt={name} />
				{name}
			</label>
		</>
	);
};

export default Category;
