import { EventEmitter } from '../base/events';
import { Modal } from '../common/modal';
import { ModalOrder } from './modalOrder';
import { ICard, IOrder } from '../../types';
import { ensureElement, cloneTemplate } from '../../utils/utils';

export class modalBasket extends Modal {
	basketTemp: HTMLTemplateElement;
	basketContent: HTMLElement;
	busketOrderButton: HTMLButtonElement;
	itemCount: number;
	totalPrice: number;
	basketPriceHTMLElement: HTMLElement;
	events: EventEmitter;
	basket: ICard[];
	order: ModalOrder;
	orderInfo: IOrder;
	// modalWindow:HTMLTemplateElement
	constructor() {
		super();
		this.events = new EventEmitter();
	}

	preOpenCallBack() {
		const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');

		this.basketTemp = cloneTemplate(basketTemplate);
		this.basketContent = ensureElement<HTMLElement>(
			'.basket__list',
			this.basketTemp
		);
		this.basketPriceHTMLElement = ensureElement<HTMLElement>(
			'.basket__price',
			this.basketTemp
		);
		this.busketOrderButton = ensureElement<HTMLButtonElement>(
			'.button',
			this.basketTemp
		);
		this.itemCount = 0;
		this.totalPrice = 0;
		this._content.appendChild(this.basketTemp);
		this.updateOrderButtonState();
		const defolt: IOrder = { total: 0, items: [] };
		this.orderInfo = defolt;
		/* console.log('This is child'); */
	}

	// addItem(title_in: string, price_in: number) {
	// 	this.itemCount++;
	// 	const cardBasketTemplate =
	// 		ensureElement<HTMLTemplateElement>('#card-basket');
	// 	const item = cloneTemplate(cardBasketTemplate);
	// 	const index = ensureElement<HTMLElement>('.basket__item-index', item);
	// 	const price = ensureElement<HTMLElement>('.card__price', item);
	// 	const title = ensureElement<HTMLElement>('.card__title', item);
	// 	index.innerText = String(this.itemCount);
	// 	title.innerText = title_in;
	// 	price.innerText = String(price_in) + ' синапсов';
	// 	this.totalPrice += price_in;
	// 	this.basketContent.appendChild(item);
	// 	this.basketPriceHTMLElement.innerText =
	// 		String(this.totalPrice) + ' синапсов';
	// 	this.updateOrderButtonState();
	// }
	addItemInterface(item: ICard) {
		this.orderInfo.items.push(item.id);
		this.itemCount++;
		const cardBasketTemplate =
			ensureElement<HTMLTemplateElement>('#card-basket');
		const cardItem = cloneTemplate(cardBasketTemplate);
		const index = ensureElement<HTMLElement>('.basket__item-index', cardItem);
		const price = ensureElement<HTMLElement>('.card__price', cardItem);
		const title = ensureElement<HTMLElement>('.card__title', cardItem);
		const deleteButton = ensureElement<HTMLElement>(
			'.basket__item-delete',
			cardItem
		);
		index.innerText = String(this.itemCount);
		title.innerText = item.title;
		price.innerText = String(item.price) + ' синапсов';
		this.totalPrice += item.price;
		this.basketContent.appendChild(cardItem);
		this.basketPriceHTMLElement.innerText =
			String(this.totalPrice) + ' синапсов';
		deleteButton.addEventListener('click', () => {
			this.removeItem(cardItem, item.price, item);
			this.events.emit('deleteCardFromBasket', item);
		});
		this.updateOrderButtonState();
	}
	removeItem(cardItem: HTMLElement, itemPrice: number, item: ICard) {
		const index = this.orderInfo.items.indexOf(item.id, 0);
		if (index > -1) {
			this.orderInfo.items.splice(index, 1);
		}
		this.itemCount--;
		this.totalPrice -= itemPrice;
		this.basketPriceHTMLElement.innerText =
			String(this.totalPrice) + ' синапсов';

		Array.from(this.basketContent.children).forEach((child, index) => {
			const itemIndex = ensureElement<HTMLElement>(
				'.basket__item-index',
				child as HTMLElement
			);
			itemIndex.innerText = String(index + 1);
		});
		this.basketContent.removeChild(cardItem);
		this.updateOrderButtonState();
	}
	init() {
		this.events.emit('onLoard');
	}
	
	updateOrderButtonState() {
		if (this.itemCount > 0) {
			this.busketOrderButton.disabled = false;
		} else {
			this.busketOrderButton.disabled = true;
			this.orderButtonClick();
		}
	}
	orderButtonClick() {
		this.busketOrderButton.addEventListener('click', () => {
			this.close();
			this.orderInfo.total = this.totalPrice;
			this.events.emit('confirm', this.orderInfo);
			// this.order = new ModalOrder();
			// this.order.open();
			// alert('orderClick');
		});
	}
	
	
}

