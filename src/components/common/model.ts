import { ICard, IOrder } from '../../types';
import { API_URL, CDN_URL } from '../../utils/constants';
import { ProductAPI } from './api';
import { ensureElement } from '../../utils/utils';

export class model {
	basketList: ICard[];
	api;
	constructor() {
		this.basketList = [];
		this.api = new ProductAPI(CDN_URL, API_URL);
	}
	getCardList() {
		const cards: string[] = ['red', 'green', 'blue'];
		//api.getCardList();
		return cards;
	}
	getCardInterface() {
		//let card: ICard[];
		//card.push(this.createCard('бусина'));
		//return card;

		return this.api.getCardList();
	}
	createCard(title: string) {
		const newCard: ICard = {
			id: 'sdfsdf',
			title: title,
			price: 555,
			description: 'sdfsd',
			image:
				'https://trikky.ru/wp-content/blogs.dir/1/files/2020/08/20/65c499e3-cc15-4869-be70-5108ff619b61.jpeg',
			category: 'софт-скилл',
			button: 'sdfsd',
		};
		return newCard;
	}
	addToBasket(item: ICard) {
		this.basketList.push(item);
		for (const item of this.basketList) {
			// console.log(item.title);
		}
	}
	removeFromBasket(item: ICard) {
		// this.basketList = this.basketList.filter(item => item.id !== id);
		const index = this.basketList.indexOf(item, 0);
		if (index > -1) {
			this.basketList.splice(index, 1);
		}
	}
	getBasketList() {
		return this.basketList;
	}
	getBasketCount() {
		return this.basketList.length;
	}
	isInBasket(item: ICard): boolean {
		const index = this.basketList.indexOf(item, 0);
		if (index > -1) {
			return true;
		}
		return false;
	}
	getBasketTotalPtice() {
		let totalPrice = 0;
		this.basketList.forEach((item) => {
			totalPrice += item.price;
		});
		return totalPrice;
	}
	sendOrder(order: IOrder) {
		return this.api.orderProduct(order);
	}
	clearBasket() {
		this.basketList = [];
	}
}
