import React, { useMemo, useState } from 'react';
import Calendar from 'react-calendar';
import { CategoryImgBig } from '../../utils/CategoryImg';
import { SvgIconArrow } from '../UI/SvgIcon/SvgIcon';
import { CalendarDate } from '../../types/CalendarDate';
import CheckboxLinear from '../UI/CheckboxLinear/CheckboxLinear';

export interface FiltersProps {
	close: () => void;
	getFilters: (selectedFilterCategory: string[], selectedDate: CalendarDate) => void;
	onClearFilters: () => void;
	filterCategory: string[];
	filterDate: CalendarDate;
}

const Filters: React.FC<FiltersProps> = ({
	close, getFilters, onClearFilters, filterCategory, filterDate
}) => {
	const [selectedCategory, setSelectedCategory] = useState<Array<string>>(filterCategory);
	const [selectedDate, setSelectedDate] = useState<CalendarDate>(filterDate);
	const [isRange, setIsRange] = useState(false);

	const onChangeCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { checked } = e.currentTarget;
		const addedCategory = e.currentTarget.id;
		setSelectedCategory((prev) => (checked
			? [...prev, addedCategory]
			: prev.filter((category) => category !== addedCategory)));
	};

	const handleCalendarChange = (date: CalendarDate) => {
		setSelectedDate(date);
	};

	const applyFilters = () => {
		getFilters(selectedCategory, selectedDate);
	};

	const clearFilters = () => {
		setSelectedCategory([]);
		setSelectedDate(undefined);
		onClearFilters();
	};

	const categoryElements = useMemo(() => CategoryImgBig.map(({ name, path }) => (
		<div key={name}>
			<input
				onChange={onChangeCategory}
				type="checkbox"
				id={name}
				name="category"
				value={name}
				className="filters__item__list"
				checked={selectedCategory?.includes(name)}
			/>
			<label className="filters__item__label" htmlFor={name}>
				<img src={path} alt={name} />
				{name}
			</label>
		</div>
	)), [selectedCategory]);

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
						{categoryElements}
					</div>
					<CheckboxLinear
						id="isRange"
						checked={isRange}
						onChange={() => setIsRange(!isRange)}
						text="Date range"
					/>
					<div className="filters__item">
						<div className="filters__item__container__calendar">
							<div className="filters__item__calendar">
								<Calendar
									locale="en"
									onChange={handleCalendarChange}
									value={selectedDate}
									maxDate={new Date()}
									minDate={new Date(2020, 0, 1)}
									selectRange={isRange}
									showNeighboringCentury={false}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="filters__actions">
					<button
						type="submit"
						onClick={applyFilters}
						className="filters__actions__btn filters__actions__btn_apply"
					>
						Apply
					</button>
					<button
						onClick={clearFilters}
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
