import React from 'react';
import arrow from '../../images/icon/arrow-right.png';

const CreateJar: React.FC = () => {
	const CloseCreatJar = () => {
	//
	};

	return (
		<div className="modal__background">
			<div className="create-jar">
				<div className="create-jar__container">
					<h3 className="create-jar__title">Create Jar</h3>
					<button className="create-jar__close" onClick={CloseCreatJar}>
						<img src={arrow} alt="arrowClose" />
					</button>
					<p className="create-jar__descr">
						Enter the short name of new jar to easy find it in a list of your jars.
						You can rename it at any later
					</p>
					<form id="create-jar" className="create-jar__form">
						<input
							className="create-jar__form__input"
							placeholder="Jar name"
							required
							type="text"
						/>
					</form>
					<button className="create-jar__btn">Create</button>
				</div>
			</div>
		</div>
	);
};

export default CreateJar;
