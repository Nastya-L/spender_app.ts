import { ComponentType, useState } from 'react';
import { IExpenseFormEditProps } from '../components/ExpenseFormEdit/ExpenseFormEdit';
import { INewExpenseNewProps } from '../components/ExpenseFormNew/ExpenseFormNew';
import { JarStatisticsProps } from '../components/JarStatistics/JarStatistics';

export type DialogueSectionPropsType =
JarStatisticsProps | INewExpenseNewProps | IExpenseFormEditProps;

export type DialogueSectionType<T> = {
	component: ComponentType<T> | null;
	props: T | null;
}

const useDialogueSection = () => {
	const [isOpenDialogueSection, setIsOpenDialogueSection] = useState<boolean>(false);
	const [
		dialogueSection,
		setDialogueSection
	] = useState<DialogueSectionType<DialogueSectionPropsType>>({
		component: null,
		props: null
	});

	const OpenDialogueSection = (component: DialogueSectionType<DialogueSectionPropsType>) => {
		setDialogueSection(component);
		if (component) {
			setIsOpenDialogueSection(true);
		} else {
			setIsOpenDialogueSection(false);
		}
	};

	const CloseDialogueSection = () => {
		setIsOpenDialogueSection(false);
	};

	return {
		CloseDialogueSection, OpenDialogueSection, isOpenDialogueSection, dialogueSection
	};
};

export default useDialogueSection;
