import React, { useState } from 'react';
import classNames from 'classnames';
import { DialogueSectionPropsType, DialogueSectionType } from '../../../hooks/useDialogueSection';

interface DialogueSectionWrapperProps {
	dialogueSection: DialogueSectionType<DialogueSectionPropsType>;
	isOpenDialogueSection: boolean;
	OpenDialogueSection: (component: DialogueSectionType<DialogueSectionPropsType>) => void;
	isLoading: boolean
}

const DialogueSectionWrapper: React.FC<DialogueSectionWrapperProps> = ({
	dialogueSection, isOpenDialogueSection,
	OpenDialogueSection, isLoading
}) => {
	const [isDialogueAnimationEnd, setIsDialogueAnimationEnd] = useState<boolean>(false);

	const onTransitionEnd = () => {
		if (!isOpenDialogueSection) {
			OpenDialogueSection(undefined);
			setIsDialogueAnimationEnd(false);
		} else {
			setIsDialogueAnimationEnd(true);
		}
	};

	return (
		<div
			className={classNames(((
				isOpenDialogueSection) ? 'dialogue-section_open' : 'dialogue-section'))}
			onTransitionEnd={onTransitionEnd}
		>
			{(dialogueSection && dialogueSection.props)
				&& (
					<dialogueSection.component
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...dialogueSection.props}
						isAnimationEnd={isDialogueAnimationEnd}
						isLoading={isLoading}
					/>
				)}
		</div>
	);
};

export default DialogueSectionWrapper;
