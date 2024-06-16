import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { IPageView, TPage, TPageActions, TUpdateCounter } from '../types';

export class Page extends Component<TPage> implements IPageView {
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;
	protected _basketCounter: HTMLElement;

	constructor(container: HTMLElement, actions: TPageActions) {
		super(container);
		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLElement>('.header__basket');
		this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter');

		if (actions?.onClick) this._basket.addEventListener('click', actions.onClick);
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set basketCounter(data: TUpdateCounter) {
		this.setText(this._basketCounter, data.count);
	}

	set locked(value: boolean) {
		if (value) this.addStyleClass(this._wrapper, 'page__wrapper_locked');
		else this.removeStyleClass(this._wrapper, 'page__wrapper_locked');
	}
}
