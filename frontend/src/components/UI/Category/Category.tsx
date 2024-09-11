import React from 'react';

interface ICategoryProps {
	name: string,
	path: string,
	checked: boolean,
	ChangeCategory: (category: string) => void
}

const Category: React.FC<ICategoryProps> = ({
	path, name, checked, ChangeCategory
}) => {
	const onChange = (e: React.FormEvent<HTMLInputElement>) => {
		ChangeCategory(e.currentTarget.value);
	};

	return (
		<>
			<input defaultChecked={checked} onChange={onChange} type="radio" id={`category-${name}`} name="category" value={name} className="category__input" />
			<label className="category__label" htmlFor={`category-${name}`}>
				<img src={path} alt={name} />
				{name}
			</label>
		</>
	);
};

export default Category;
