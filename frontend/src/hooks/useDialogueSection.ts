import { ComponentType, useState } from 'react';
import { IExpenseFormEditProps } from '../components/ExpenseFormEdit/ExpenseFormEdit';
import { INewExpenseNewProps } from '../components/ExpenseFormNew/ExpenseFormNew';
import { JarStatisticsProps } from '../components/JarStatistics/JarStatistics';

type DialogueSectionPropsType = JarStatisticsProps | INewExpenseNewProps | IExpenseFormEditProps;

type DialogueSectionType<T> = {
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
		setIsOpenDialogueSection(true);
		setDialogueSection(component);
		if (!component) {
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
