import { ensureElement } from '../../utils/utils';
import { ICard } from '../../types';
import { Card } from '../common/Card';
import { EventEmitter } from '../base/events';
import { frontendAplication } from './frontendAplication';
//менять цифру товаров в корзине + добавлять карточку
export class page {
	gallery: HTMLTemplateElement;
	events: EventEmitter;
	private basketCounter: HTMLElement;
	constructor() {
		this.gallery = ensureElement<HTMLTemplateElement>('.gallery');
		this.events = new EventEmitter();
		const basket = ensureElement<HTMLTemplateElement>('.header__basket');
		this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
		basket.addEventListener('click', () => {
			this.events.emit('basketClick');
		});
	}
	set basketCount(value: number) {
		this.basketCounter.innerText = String(value);
	}
	addCard(item: ICard) {
		const card = new Card();
		card.category = item.category;
		card.description = item.description;
		card.image = item.image;
		card.price = item.price;
		card.title = item.title;
		this.gallery.appendChild(card.HtmlItem);
		card.HtmlItem.addEventListener('click', () => {
			// frontendAplication.openModalPreview(item);
			this.events.emit('cardClick', item);
		});
	}
	addCardFn(
		category: string,
		title: string,
		price: number | null,
		description: string,
		image: string
	) {
		const card = new Card();
		card.category = category;
		card.description = description;
		card.image = image;
		card.price = price;
		card.title = title;
		this.gallery.appendChild(card.HtmlItem);
	}
	init() {
		this.events.emit('page:init');
		setInterval((): void => {
			// 	console.log('This will be displayed every 1000ms (1s).');
			this.events.emit('intervalCounter');
		}, 1000);
	}
}
