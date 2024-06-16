import { ModalPreview } from '../modalView/modalPreview';
// import * as utils from './utils/utils';
import { cloneTemplate, ensureElement } from '../../utils/utils';

export class Card {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _button: HTMLButtonElement;
	protected _category: HTMLSpanElement;
	protected _price: HTMLSpanElement;
	protected _description?: HTMLElement;
	protected _HtmlItem: HTMLElement;

	constructor() {
		const cardCatalogTemplate =
			ensureElement<HTMLTemplateElement>('#card-catalog');
		const cardPreviewTemplate =
			ensureElement<HTMLTemplateElement>('#card-preview');
		const previewContainer = cloneTemplate(cardPreviewTemplate);
		const container = cloneTemplate(cardCatalogTemplate);
		this._HtmlItem = container;
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._price = ensureElement<HTMLSpanElement>(`.card__price`, container);
		this._category = container.querySelector(`.card__category`);
		this._button = container.querySelector(`.card__button`);
		this._image = container.querySelector(`.card__image`);
		this._description = ensureElement<HTMLElement>(
			`.card__text`,
			previewContainer
		);
		// this.noPriceProduct(this.price);
		// container.querySelector(`.card__text`);
	}

	set title(value: string) {
		this._title.innerText = value;
	}
	get HtmlItem() {
		return this._HtmlItem;
	}
	set price(value: number | null) {
		if (value === null) {
			this._price.innerText = 'Бесценный товар';
		} else {
			this._price.innerText = `стоит  ${value} синапсы`;
		}
		
	}
	set category(value: string) {
		this._category.innerHTML = value;
	}
	set image(value: string) {
		this._image.src = value;
	}
	set description(value: string) {
		this._description.innerText = value;
	}
	openPreview() {
		this._HtmlItem.addEventListener('click', () => {
			// const modal = new  ModalPreview();
			// modal.open();
			alert('ghbdtn');
		});
	}
	
}
