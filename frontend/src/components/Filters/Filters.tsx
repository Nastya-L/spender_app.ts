/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useParams } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import { CategoryImgBig } from '../../utils/CategoryImg';
import { SvgIconArrow } from '../UI/SvgIcon/SvgIcon';

export interface FiltersProps {
	close: () => void;
	GetFilters: (selectedFilter: string[]) => void;
	ClickClear: () => void;
	filters: string[];
}

const Filters: React.FC<FiltersProps> = ({
	close, GetFilters, ClickClear, filters
}) => {
	const { id } = useParams();
	const [selectedFilter, setSelectedFilter] = useState<Array<string>>(filters);

	const onChangeFilters = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { checked } = e.currentTarget;
		const idFilter = e.currentTarget.id;
		setSelectedFilter((prev) => (checked
			? [...prev, idFilter]
			: prev.filter((fil) => fil !== idFilter)));
	};

	useEffect(() => {
		setSelectedFilter(filters);
	}, [id]);

	const ApplyFilters = () => {
		GetFilters(selectedFilter);
	};

	const ClearFilters = () => {
		setSelectedFilter([]);
		ClickClear();
	};

	const categoryElements = useMemo(() => CategoryImgBig.map(({ name, path }) => (
		<div key={name}>
			<input
				onChange={onChangeFilters}
				type="checkbox"
				id={name}
				name="category"
				value={name}
				className="filters__item__list"
				checked={selectedFilter.includes(name)}
			/>
			<label className="filters__item__label" htmlFor={name}>
				<img src={path} alt={name} />
				{name}
			</label>
		</div>
	)), [selectedFilter]);

	return (
		<div className="filters">
			<div className="filters__container">
				<h3 className="filters__title">Filters</h3>
				<button
					aria-label="arrow"
					onClick={close}
					className="filters__close"
				>
					<SvgIconArrow />
				</button>
				<div className="filters__wrapper">
					<div className="filters__item">
						<ul className="filters__item__container">
							{categoryElements}
						</ul>
					</div>
					<div className="filters__item">
						<div className="filters__item__container">
							Date
						</div>
					</div>
				</div>
				<div className="filters__actions">
					<button
						type="submit"
						onClick={ApplyFilters}
						className="filters__actions__btn filters__actions__btn_apply"
					>
						Apply
					</button>
					<button
						onClick={ClearFilters}
						className="filters__actions__btn filters__actions__btn_clear"
					>
						Clear
					</button>
				</div>
			</div>
		</div>
	);
};

export default Filters;
