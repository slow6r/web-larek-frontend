import { EventEmitter } from '../base/events';
import { Modal } from '../common/modal';
import { modalBasket } from './modalBasket';
import { model } from '../common/model';
import { ICard } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';

export class ModalPreview extends Modal {
	previewContent: HTMLTemplateElement;
	titlePreview: HTMLElement;
	textPreview: HTMLElement;
	pricePreview: HTMLElement;
	imagePreview: HTMLImageElement;
	addButtonToBasket: HTMLButtonElement;
	categoryPreview: HTMLElement;
	cardInterface: ICard;
	events: EventEmitter;
	modalBasket: modalBasket;
	basketState: boolean;
	constructor() {
		super();
		this.events = new EventEmitter();
		this.modalBasket = new modalBasket();
		this.basketState = false;
	}

	preOpenCallBack() {
		const cardPreviewTemplate =
			ensureElement<HTMLTemplateElement>('#card-preview');
		this.previewContent = cloneTemplate(cardPreviewTemplate);
		this.titlePreview = ensureElement<HTMLElement>(
			'.card__title',
			this.previewContent
		);
		this.textPreview = ensureElement<HTMLElement>(
			'.card__text',
			this.previewContent
		);
		this.pricePreview = ensureElement<HTMLElement>(
			'.card__price',
			this.previewContent
		);
		this.imagePreview = ensureElement<HTMLImageElement>(
			'.card__image',
			this.previewContent
		);
		this.addButtonToBasket = ensureElement<HTMLButtonElement>(
			'.card__button',
			this.previewContent
		);
		this.categoryPreview = ensureElement<HTMLElement>(
			'.card__category',
			this.previewContent
		);

		this._content.appendChild(this.previewContent);
		this.addButtonToBasket.addEventListener('click', () => {
			// this.events.emit('addToBasketClick', this.cardInterface);

			// if (this.isInBasket(this.cardInterface)) {
			// 	this.events.emit('removeFromBasketClick', this.cardInterface);
			// 	// this.modalBasket.removeItem(,this.cardInterface.price )
			// 	// this.removeItem(this.cardInterface);
			// 	this.updateButton(false);
			// } else {
			// 	this.events.emit('addToBasketClick', this.cardInterface);
			// 	// this.basket.addItemInterface(this.cardInterface);
			// 	this.updateButton(true);
			// }

			if (this.basketState) {
				this.events.emit('removeFromBasketClick', this.cardInterface);
			} else {
				this.events.emit('addToBasketClick', this.cardInterface);
			}

			// this.events.emit('removeFromBasketPreview', this.cardInterface);
			this.close();
			/* // 	const card = ensureElement<HTMLElement>('.card', this.previewContent);
			const modal = new modalBasket();
			const title = ensureElement<HTMLElement>(
				'.card__title',
				this.previewContent
			);
			const price = ensureElement<HTMLElement>(
				'.card__price',
				this.previewContent
			);
			modal.addItem(title.innerText, Number(price.innerText)); */
		});
	}

	// isInBasket(item: ICard): boolean {
	// 	return this.modalBasket.basket.some(
	// 	  (basketItem) => basketItem.id === item.id
	// 	);}

	updateButton(isInBasket: boolean) {
		if (isInBasket) {
			this.addButtonToBasket.innerText = 'Удалить из корзины';
		} else {
			this.addButtonToBasket.innerText = 'Добавить в корзину';
		}
		this.basketState = isInBasket;
	}
	openForCard(item: ICard) {
		this.open();
		this.events.emit('infoLoarded', item);
		this.noPriceProduct(item.price);
		this.cardInterface = item;
		this.title = item.title;
		this.price = item.price;
		this.category = item.category;
		this.image = item.image;
		this.description = item.description;
	}
	addToBasket() {}
	noPriceProduct(value: number | null) {
		if (value === null) {
			this.addButtonToBasket.disabled = true;
		} else {
			this.addButtonToBasket.disabled = false;
		}
	}
	set title(value: string) {
		this.titlePreview.innerText = value;
	}
	set price(value: number) {
		if (value === null) {
			this.pricePreview.innerText = 'Бесценный товар';
		} else {
			this.pricePreview.innerText = `стоит  ${value} синапсы`;
		}
	}
	set category(value: string) {
		this.categoryPreview.innerHTML = value;
	}
	set image(value: string) {
		this.imagePreview.src = value;
	}
	set description(value: string) {
		this.textPreview.innerText = value;
	}
}
