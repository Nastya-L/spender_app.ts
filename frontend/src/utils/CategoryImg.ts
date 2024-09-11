import carSmall from '../images/icon/car-small.png';
import subwaySmall from '../images/icon/subway-small.png';
import utensilsSmall from '../images/icon/utensils-small.png';
import clothesSmall from '../images/icon/clothes-small.png';
import barberShopSmall from '../images/icon/barber-shop-small.png';
import basketSmall from '../images/icon/basket-small.png';
import healthSmall from '../images/icon/health-small.png';
import houseSmall from '../images/icon/house-small.png';
import musicSmall from '../images/icon/music-small.png';
import paymentSmall from '../images/icon/payment-small.png';

import car from '../images/icon/car.png';
import subway from '../images/icon/subway.png';
import utensils from '../images/icon/utensils.png';
import clothes from '../images/icon/clothes.png';
import barberShop from '../images/icon/barber-shop.png';
import basket from '../images/icon/basket.png';
import health from '../images/icon/health.png';
import house from '../images/icon/house.png';
import music from '../images/icon/music.png';
import payment from '../images/icon/payment.png';

interface ICategoryType {
	name: string,
	path: string
}

export const CategoryImgSmall: ICategoryType[] = [
	{
		name: 'car',
		path: carSmall
	},
	{
		name: 'travel',
		path: subwaySmall
	},
	{
		name: 'cafes',
		path: utensilsSmall
	},
	{
		name: 'shopping',
		path: clothesSmall
	},
	{
		name: 'selfcare',
		path: barberShopSmall
	},
	{
		name: 'products',
		path: basketSmall
	},
	{
		name: 'health',
		path: healthSmall
	},
	{
		name: 'house',
		path: houseSmall
	},
	{
		name: 'rest',
		path: musicSmall
	},
	{
		name: 'payments',
		path: paymentSmall
	}
];

export const CategoryImgBig: ICategoryType[] = [
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

export const GetCategoryImg = (expenseCategory: string) => CategoryImgSmall
	.find((category) => category.name === expenseCategory);
