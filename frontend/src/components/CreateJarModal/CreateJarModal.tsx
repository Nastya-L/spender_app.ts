import React from 'react';
import ColorOption from '../UI/ColorOption/ColorOption';

const CreateJarModal: React.FC = () => {
	const defaultColors = ['FFE074', 'FF9C64', 'FA7878', 'F881DE', 'B28FFE', '5E90F2', '07A4B9', '5BE8B1', '42AE31', 'B23B98'];

	return (
		<div className="create-jar">
			<h3 className="create-jar__title">Create Jar</h3>
			<p className="create-jar__descr">
				Enter the short name of new jar to easy find it in a list of your jars.
				You can rename it at any time later
			</p>
			<form id="create-jar" className="create-jar__form">
				<input
					className="create-jar__form__input"
					placeholder="Jar name"
					required
					type="text"
				/>
			</form>
			<div className="create-jar__color">
				{defaultColors.map((color) => <ColorOption key={color} colorItem={color} />)}
			</div>
			<button className="create-jar__btn">Create</button>
		</div>
	);
};

export default CreateJarModal;
