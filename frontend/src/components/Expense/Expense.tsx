/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import classNames from 'classnames';
import { IExpense } from '../../interfaces/Expense';
import { GetCategoryImg } from '../../utils/CategoryImg';
import edit from '../../images/icon/pencil.png';

interface IExpenseProps {
	expense: IExpense
	ClickToEdit: (id: string) => void
	ClickToExpense: (id: string) => void
	selected: boolean
}

const Expense: React.FC<IExpenseProps> = ({
	expense, ClickToEdit, ClickToExpense, selected
}) => {
	const categoryImg = GetCategoryImg(expense.category);

	const onClickEdit = () => {
		ClickToEdit(expense._id);
	};

	const onClickExpense = (e: React.FormEvent<HTMLDivElement>) => {
		ClickToExpense(e.currentTarget.id);
	};

	return (
		<div className="expense__wrap">
			<div
				id={expense._id}
				className={classNames('expense', ((selected) && 'expense__collapse-to-edit'))}
				onClick={onClickExpense}
			>
				<div className="expense__descr">
					<div className="expense__categories-icon">
						<img src={categoryImg.path} alt="categories-icon" />
					</div>
					<div className="expense__descr-wrap">
						<div className="expense__categories">
							{expense.category}
						</div>
						<div className="expense__owner">
							{expense.owner.firstName}
						</div>
					</div>
				</div>
				<div className="expense__value">{`${expense.value}₴`}</div>
			</div>
			<div className="expense__edit">
				<button onClick={onClickEdit} className="expense__edit__btn">
					<img src={edit} alt="edit" />
				</button>
			</div>
		</div>
	);
};

export default Expense;
