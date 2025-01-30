import React, { ReactNode } from 'react';

interface AddExpenseButtonProps {
	OpenNewExpense: () => void;
	icon: ReactNode;
}

const AddExpenseButton: React.FC<AddExpenseButtonProps> = ({ OpenNewExpense, icon }) => (
	<button aria-label="add" onClick={OpenNewExpense}>
		{icon}
	</button>
);

export default AddExpenseButton;
