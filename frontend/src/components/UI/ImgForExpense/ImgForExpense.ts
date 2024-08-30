import car from '../../../images/icon/car-small.png';
import subway from '../../../images/icon/subway-small.png';
import utensils from '../../../images/icon/utensils-small.png';
import clothes from '../../../images/icon/clothes-small.png';
import barberShop from '../../../images/icon/barber-shop-small.png';
import basket from '../../../images/icon/basket-small.png';
import health from '../../../images/icon/health-small.png';
import house from '../../../images/icon/house-small.png';
import music from '../../../images/icon/music-small.png';
import payment from '../../../images/icon/payment-small.png';

interface ICategoryType {
	name: string,
	path: string
}

const ImgForExpense: ICategoryType[] = [
	{
		name: 'car',
		path: car
	},
	{
		name: 'travel',
		path: subway
	},
	{
		name: 'cafes',
		path: utensils
	},
	{
		name: 'shopping',
		path: clothes
	},
	{
		name: 'selfcare',
		path: barberShop
	},
	{
		name: 'products',
		path: basket
	},
	{
		name: 'health',
		path: health
	},
	{
		name: 'house',
		path: house
	},
	{
		name: 'rest',
		path: music
	},
	{
		name: 'payments',
		path: payment
	}
];

export default ImgForExpense;
