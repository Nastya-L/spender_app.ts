import React, { useEffect, useState } from 'react';
import { ErrorResponse, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import authClient, { IAuthClientError } from '../../services/authClient';
import { IAuthState } from '../../interfaces/AuthState';
import { SvgIconArrow } from '../UI/SvgIcon/SvgIcon';
import { IStatistics, ITotalAmounts } from '../../interfaces/Statistics';
import { GetCategoryImg } from '../../utils/CategoryImg';
import JarStatisticsPreloader from '../UI/JarStatisticsPreloader/JarStatisticsPreloader';

export interface JarStatisticsProps {
	close: () => void;
}

const JarStatistics: React.FC<JarStatisticsProps> = ({ close }) => {
	const userId = useSelector((state: IAuthState) => state.auth.user.id);
	const { id } = useParams();
	const navigate = useNavigate();
	const [statistics, setStatistics] = useState<Array<ITotalAmounts>>(null);
	const [isPreloader, setIsPreloader] = useState<boolean>(true);

	const SortArrayStatistic = (a: ITotalAmounts, b: ITotalAmounts) => {
		if (a.userId === userId) {
			return -1;
		}
		if (b.userId === userId) {
			return 1;
		}
		return 0;
	};

	useEffect(() => {
		setStatistics(null);
		setIsPreloader(true);
		authClient.get<IStatistics>(`/statistic/${id}`)
			.then((response) => {
				const { totalAmounts } = response.data;
				if (!totalAmounts) {
					close();
				} else {
					setStatistics(totalAmounts.sort((a, b) => (SortArrayStatistic(a, b))));
				}
			}).catch((error: IAuthClientError) => {
				if (error.redirect) {
					navigate(error.redirect);
					return;
				}
				if (axios.isAxiosError<ErrorResponse, Record<string, unknown>>(error)) {
					if (!error.response) {
						toast.error('Something went wrong');
					}
				}
			}).finally(() => {
				setIsPreloader(false);
			});
	}, [id]);

	return (
		<div className="statistics-jar">
			<h2 className="statistics-jar__title">Statistics</h2>
			<button aria-label="arrow" onClick={() => (close())} className="statistics-jar__close">
				<SvgIconArrow />
			</button>
			{isPreloader
				? <JarStatisticsPreloader />
				: (statistics && (statistics.map((amount) => (
					<div key={amount.userId} className="statistics-jar__wrapper">
						<div className="statistics-jar__user">
							<p className="statistics-jar__user__name">{amount.firstName}</p>
							<p className="statistics-jar__user__sum">
								{amount.totalAmount}
								₴
							</p>
						</div>
						<div className="statistics-jar__categories">
							{amount.categories
								&& amount.categories.map((category) => {
									const categoryImg = GetCategoryImg(category.category);
									return (
										<div key={category.category} className="statistics-jar__categories__item">
											<div className="statistics-jar__categories__icon">
												<img src={categoryImg.path} alt={categoryImg.name} />
											</div>
											<div>
												<p className="statistics-jar__categories__sum">
													{category.categoryAmount}
													₴
												</p>
												<p className="statistics-jar__categories__category">{category.category}</p>
											</div>
										</div>
									);
								})}
						</div>
					</div>
				))))}
		</div>
	);
};

export default JarStatistics;
